import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { useVoiceCommand } from '@/hooks/useVoiceCommand';
import { FBXLoader, OBJLoader } from 'three-stdlib';

declare global {
  interface Window {
    Hands: any;
  }
}

export function CameraHologram({ onClose }: { onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const [loadingMsg, setLoadingMsg] = useState("Generating 3D Models & Hand Tracking...");

  useEffect(() => {
    let isDestroyed = false;
    let handsObj: any = null;

    const init = async () => {
      // Load scripts dynamically
      const loadScript = (src: string) => new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) return resolve(true);
        const script = document.createElement('script');
        script.src = src;
        script.crossOrigin = "anonymous";
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });

      try {
        await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js');
      } catch (e) {
        console.error("Failed to load Mediapipe", e);
        setLoadingMsg("Failed to load hand tracking.");
        return;
      }
      if (isDestroyed) return;

      // Start camera
      let stream: MediaStream;
      try {
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            await new Promise(resolve => {
                videoRef.current!.onloadedmetadata = () => resolve(true);
            });
            videoRef.current.play();
          }
      } catch (err) {
          console.error("Camera error:", err);
          setLoadingMsg("Camera access denied.");
          return;
      }

      // Three.js setup
      const w = window.innerWidth;
      const h = window.innerHeight;
      const scene = new THREE.Scene();
      
      // Add global illumination
      scene.add(new THREE.AmbientLight(0x404040));
      const dirLight = new THREE.DirectionalLight(0xffffff, 1);
      dirLight.position.set(5, 10, 7);
      scene.add(dirLight);
      
      const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(w, h);
      if (mountRef.current) {
          mountRef.current.appendChild(renderer.domElement);
      }
      camera.position.z = 5;

      // The Hologram Container (moves with hand, does NOT rotate)
      const hologramContainer = new THREE.Group();
      scene.add(hologramContainer);

      // 1. The Wireframe Box (White lines, dots at corners, fixed rotation)
      const boxSize = 2.5;
      const boxGeometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
      const boxEdges = new THREE.EdgesGeometry(boxGeometry);
      const boxMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 });
      const box = new THREE.LineSegments(boxEdges, boxMaterial);
      
      const pointsGeometry = new THREE.BufferGeometry();
      const positions = new Float32Array([
        boxSize/2, boxSize/2, boxSize/2,   -boxSize/2, boxSize/2, boxSize/2,   boxSize/2, -boxSize/2, boxSize/2,   -boxSize/2, -boxSize/2, boxSize/2,
        boxSize/2, boxSize/2, -boxSize/2,  -boxSize/2, boxSize/2, -boxSize/2,  boxSize/2, -boxSize/2, -boxSize/2,  -boxSize/2, -boxSize/2, -boxSize/2
      ]);
      pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const pointsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });
      const points = new THREE.Points(pointsGeometry, pointsMaterial);
      box.add(points);
      
      hologramContainer.add(box);

      // Star Rain Particles (Full screen)
      const starGeo = new THREE.BufferGeometry();
      const starCount = 3000;
      const starPos = new Float32Array(starCount * 3);
      const starVel = new Float32Array(starCount);
      for(let i=0; i<starCount; i++) {
          starPos[i*3] = (Math.random() - 0.5) * 40;
          starPos[i*3+1] = Math.random() * 20; // start above
          starPos[i*3+2] = (Math.random() - 0.5) * 40 - 10;
          starVel[i] = 0.05 + Math.random() * 0.1;
      }
      starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
      const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.05, transparent: true, opacity: 0.8 });
      const stars = new THREE.Points(starGeo, starMat);
      stars.visible = false;
      scene.add(stars);

      // Inner Objects Container (Rotates inside the box)
      const innerObjectsContainer = new THREE.Group();
      hologramContainer.add(innerObjectsContainer);

      // ==========================================
      // PROCEDURAL 3D MODEL GENERATORS
      // ==========================================

      const clock = new THREE.Clock();
      const mixers: THREE.AnimationMixer[] = [];

      const createFBXCharacter = () => {
          const group = new THREE.Group();
          
          const loader = new FBXLoader();
          loader.load('/models/CatwalkIdle.fbx', (object) => {
              // Scale down (Mixamo FBX is usually very large)
              object.scale.set(0.015, 0.015, 0.015);
              
              // Center it based on bounding box
              const box = new THREE.Box3().setFromObject(object);
              const center = box.getCenter(new THREE.Vector3());
              // Keep the feet near the bottom of the hologram box
              object.position.set(-center.x, -1.0, -center.z);

              // Animations
              if (object.animations && object.animations.length > 0) {
                  const mixer = new THREE.AnimationMixer(object);
                  const action = mixer.clipAction(object.animations[0]);
                  action.setEffectiveTimeScale(1);
                  action.setEffectiveWeight(1);
                  action.play();
                  mixers.push(mixer);
              }

              group.add(object);
          });
          
          const light = new THREE.PointLight(0xffffff, 4, 10);
          light.position.set(0, 2, 2);
          group.add(light);
          
          group.userData = {
              update: (time: number) => {
                  // Keep it standing straight, no wobble needed for this character
              }
          };
          
          return group;
      };

      const createButterfly = () => {
          const group = new THREE.Group();
          
          // Body
          const bodyGeo = new THREE.CapsuleGeometry(0.04, 0.4, 8, 8);
          const bodyMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.5 });
          const body = new THREE.Mesh(bodyGeo, bodyMat);
          body.rotation.x = Math.PI / 2;
          group.add(body);

          // Wing Shape
          const shape = new THREE.Shape();
          shape.moveTo(0, 0);
          shape.bezierCurveTo(0.2, 0.5, 1.0, 1.0, 1.2, 0.6); // Top wing
          shape.bezierCurveTo(1.4, 0.2, 1.2, -0.2, 0.9, -0.4); 
          shape.bezierCurveTo(1.0, -0.9, 0.6, -1.2, 0.2, -0.9); // Bottom wing
          shape.bezierCurveTo(0.1, -0.7, 0.1, -0.3, 0, 0);

          const extrudeSettings = { depth: 0.02, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.01, bevelThickness: 0.01 };
          const wingGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
          
          const wingMat = new THREE.MeshStandardMaterial({ 
              color: 0x0055ff, 
              emissive: 0x0022cc,
              roughness: 0.2,
              metalness: 0.8,
              side: THREE.DoubleSide
          });

          const wingL = new THREE.Mesh(wingGeo, wingMat);
          const wingR = new THREE.Mesh(wingGeo, wingMat);
          wingR.rotation.y = Math.PI; 
          wingR.rotation.x = Math.PI; // Correct orientation for right wing

          group.add(wingL, wingR);

          const light = new THREE.PointLight(0x0055ff, 2, 4);
          group.add(light);

          group.userData = {
              update: (time: number) => {
                  const flap = Math.sin(time * 15) * 0.8;
                  wingL.rotation.y = flap;
                  wingR.rotation.y = -flap + Math.PI;
                  group.position.y = Math.sin(time * 5) * 0.1;
              }
          };
          
          return group;
      };

      const createJellyfish = () => {
          const group = new THREE.Group();
          
          // Cap
          const capGeo = new THREE.SphereGeometry(0.6, 32, 16, 0, Math.PI * 2, 0, Math.PI / 1.7);
          capGeo.scale(1, 1.2, 1);
          const capMat = new THREE.MeshPhysicalMaterial({ 
              color: 0x00ffff, 
              emissive: 0x0066ff,
              transparent: true, 
              opacity: 0.7,
              roughness: 0.1,
              transmission: 0.9,
              side: THREE.DoubleSide
          });
          const cap = new THREE.Mesh(capGeo, capMat);
          group.add(cap);

          // Inner glowing core
          const core = new THREE.Mesh(
              new THREE.SphereGeometry(0.2, 16, 16),
              new THREE.MeshBasicMaterial({ color: 0xffffff })
          );
          core.position.y = 0.2;
          group.add(core);

          const light = new THREE.PointLight(0x00ffff, 3, 5);
          group.add(light);

          // Tentacles
          const tentacles: any[] = [];
          const tMat = new THREE.LineBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.8 });
          
          for(let i=0; i<12; i++) {
              const points = [];
              for(let j=0; j<15; j++) points.push(new THREE.Vector3(0, -j*0.1, 0));
              const curve = new THREE.CatmullRomCurve3(points);
              const tGeo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(20));
              const line = new THREE.Line(tGeo, tMat);
              
              const angle = (i / 12) * Math.PI * 2;
              const radius = 0.4;
              line.position.set(Math.cos(angle)*radius, 0, Math.sin(angle)*radius);
              
              group.add(line);
              tentacles.push({ line, angle });
          }

          group.userData = {
              update: (time: number) => {
                  group.position.y = Math.sin(time * 2) * 0.2 + 0.2;
                  const capScale = 1.0 + Math.sin(time * 4) * 0.05;
                  cap.scale.set(capScale, capScale * 1.1, capScale);
                  
                  tentacles.forEach((t) => {
                      const positions = t.line.geometry.attributes.position.array;
                      for(let j=0; j<21; j++) {
                          const y = -j * 0.08;
                          const wave = Math.sin(time * 3 - j * 0.5 + t.angle) * 0.15 * (j/20);
                          positions[j*3] = wave * Math.cos(t.angle);
                          positions[j*3+1] = y;
                          positions[j*3+2] = wave * Math.sin(t.angle);
                      }
                      t.line.geometry.attributes.position.needsUpdate = true;
                  });
              }
          };
          
          return group;
      };

      const createLily = () => {
          const group = new THREE.Group();
          
          // Stem
          const stem = new THREE.Mesh(
              new THREE.CylinderGeometry(0.03, 0.04, 2.0, 8),
              new THREE.MeshStandardMaterial({ color: 0x22aa22, roughness: 0.8 })
          );
          stem.position.y = -1.0;
          group.add(stem);

          // Petals
          const pShape = new THREE.Shape();
          pShape.moveTo(0, 0);
          pShape.quadraticCurveTo(0.3, 0.5, 0.0, 1.2);
          pShape.quadraticCurveTo(-0.3, 0.5, 0, 0);

          const pGeo = new THREE.ExtrudeGeometry(pShape, { depth: 0.02, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.01, bevelThickness: 0.01 });
          
          // Curve the petal
          const pos = pGeo.attributes.position;
          for(let i=0; i<pos.count; i++) {
              const y = pos.getY(i);
              const z = pos.getZ(i);
              const bend = Math.sin(y * Math.PI * 0.5) * 0.4;
              pos.setZ(i, z + bend);
          }
          pGeo.computeVertexNormals();

          const pMat = new THREE.MeshStandardMaterial({ 
              color: 0xff33aa, 
              emissive: 0x550022,
              roughness: 0.4,
              side: THREE.DoubleSide
          });

          for(let i=0; i<6; i++) {
              const petal = new THREE.Mesh(pGeo, pMat);
              petal.rotation.y = (i / 6) * Math.PI * 2;
              petal.rotation.x = 0.6; // fold out
              group.add(petal);
          }

          // Stamens
          for(let i=0; i<6; i++) {
              const stamen = new THREE.Mesh(
                  new THREE.CylinderGeometry(0.008, 0.015, 0.8),
                  new THREE.MeshBasicMaterial({ color: 0xffdd55 })
              );
              stamen.rotation.y = (i / 6) * Math.PI * 2;
              stamen.rotation.x = 0.2;
              stamen.position.y = 0.3;
              group.add(stamen);
          }

          const light = new THREE.PointLight(0xff33aa, 2, 4);
          light.position.y = 0.5;
          group.add(light);

          group.userData = {
              update: (time: number) => {
                  group.rotation.y = time * 0.3;
              }
          };
          
          return group;
      };

      const createDragon = () => {
          const group = new THREE.Group();
          
          const mat = new THREE.MeshStandardMaterial({ 
              color: 0xff1100, 
              emissive: 0x880000,
              roughness: 0.3, 
              metalness: 0.6 
          });

          // Body (Curved)
          const bodyPts = [];
          for(let i=0; i<=10; i++) {
              const t = i/10;
              bodyPts.push(new THREE.Vector2(Math.sin(t*Math.PI)*0.15 + 0.02, t * 1.5 - 0.75));
          }
          const bodyGeo = new THREE.LatheGeometry(bodyPts, 16);
          const body = new THREE.Mesh(bodyGeo, mat);
          group.add(body);

          // Head
          const head = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.4, 8), mat);
          head.position.set(0, 0.8, 0.15);
          head.rotation.x = Math.PI / 2;
          group.add(head);

          // Wings
          const wShape = new THREE.Shape();
          wShape.moveTo(0, 0);
          wShape.lineTo(1.5, 0.6); // Top edge
          wShape.quadraticCurveTo(1.2, 0.2, 1.8, 0.0); // Spike 1
          wShape.quadraticCurveTo(1.0, -0.2, 1.4, -0.5); // Spike 2
          wShape.quadraticCurveTo(0.6, -0.4, 0.0, -0.8); // Bottom edge
          wShape.lineTo(0, 0);

          const wGeo = new THREE.ExtrudeGeometry(wShape, { depth: 0.03, bevelEnabled: true, bevelSize: 0.01, bevelThickness: 0.01 });
          wGeo.translate(0.1, 0, 0);

          const wingL = new THREE.Mesh(wGeo, mat);
          const wingR = new THREE.Mesh(wGeo, mat);
          wingR.rotation.y = Math.PI; 
          
          wingL.position.y = 0.3;
          wingR.position.y = 0.3;

          group.add(wingL, wingR);

          const light = new THREE.PointLight(0xff2200, 3, 5);
          group.add(light);

          group.userData = {
              update: (time: number) => {
                  const flap = Math.sin(time * 12) * 0.8 + 0.2;
                  wingL.rotation.y = flap;
                  wingR.rotation.y = -flap + Math.PI;
                  
                  group.position.y = Math.sin(time * 4) * 0.15;
                  group.rotation.x = Math.sin(time * 2) * 0.1;
              }
          };
          
          return group;
      };

      const createLibrarianMonster = () => {
          const group = new THREE.Group();
          
          const objLoader = new OBJLoader();
          const textureLoader = new THREE.TextureLoader();
          
          const diffuseMap = textureLoader.load('/models/librarian/act_bibliotekar.jpg');
          const normalMap = textureLoader.load(encodeURI('/models/librarian/act_bibliotekar norm.jpg'));
          
          const mat = new THREE.MeshStandardMaterial({
              map: diffuseMap,
              normalMap: normalMap,
              roughness: 0.8,
              metalness: 0.1,
              side: THREE.DoubleSide // Ensure it renders even if normals are flipped
          });
          
          // Temporary placeholder while loading
          const placeholder = new THREE.Mesh(
              new THREE.BoxGeometry(0.5, 0.5, 0.5),
              new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
          );
          group.add(placeholder);

          objLoader.load('/models/librarian/Librarian.obj', (obj) => {
              console.log("Librarian OBJ loaded successfully!", obj);
              
              // Remove placeholder
              group.remove(placeholder);

              obj.traverse((child) => {
                  if ((child as THREE.Mesh).isMesh) {
                      const mesh = child as THREE.Mesh;
                      mesh.material = mat;
                  }
              });
              
              // Ensure matrices are updated before calculating bounding box
              obj.updateMatrixWorld(true);
              
              const box = new THREE.Box3().setFromObject(obj);
              const size = box.getSize(new THREE.Vector3());
              const maxDim = Math.max(size.x, size.y, size.z);
              
              console.log("Librarian size:", size, "maxDim:", maxDim);

              if (maxDim > 0) {
                  const scale = 2.0 / maxDim; // Make it fit in the hologram nicely
                  obj.scale.set(scale, scale, scale);
                  
                  // Recompute box after scale to center perfectly
                  obj.updateMatrixWorld(true);
                  const boxScaled = new THREE.Box3().setFromObject(obj);
                  const center = boxScaled.getCenter(new THREE.Vector3());
                  
                  obj.position.set(-center.x, -center.y - 0.2, -center.z);
              }
              
              group.add(obj);
          }, 
          (xhr) => {
              console.log((xhr.loaded / xhr.total * 100) + '% loaded');
          }, 
          (error) => {
              console.error('An error happened loading the OBJ', error);
          });
          
          const light = new THREE.PointLight(0xff0000, 4, 6); // Red creepy light
          light.position.set(0, 1, 0);
          group.add(light);

          group.userData = {
              update: (time: number) => {
                  group.rotation.y = Math.sin(time) * 0.3;
                  group.position.y = Math.sin(time * 2) * 0.1;
              }
          };
          
          return group;
      };

      const innerObjects = [
          createFBXCharacter(),
          createLibrarianMonster(),
          createButterfly(),
          createJellyfish(),
          createLily(),
          createDragon()
      ];

      // Setup state
      let currentObjIndex = 0;
      let holoVisible = true;
      let holoScale = 0; 
      let targetScale = 1;
      
      let currentInnerObject = innerObjects[currentObjIndex];
      innerObjectsContainer.add(currentInnerObject);

      // Internal Particles (Bounce inside the box)
      const pCount = 500;
      const pGeo = new THREE.BufferGeometry();
      const pPos = new Float32Array(pCount * 3);
      const pVel: THREE.Vector3[] = [];
      const pColors = new Float32Array(pCount * 3);
      
      for(let i=0; i<pCount; i++){
          pPos[i*3] = 0;
          pPos[i*3+1] = 0;
          pPos[i*3+2] = 0;
          pVel.push(new THREE.Vector3((Math.random()-0.5)*0.2, (Math.random()-0.5)*0.2, (Math.random()-0.5)*0.2));
          pColors[i*3] = 1; pColors[i*3+1] = 1; pColors[i*3+2] = 1;
      }
      pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
      pGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3));
      
      const pMat = new THREE.PointsMaterial({ size: 0.05, vertexColors: true, transparent: true, opacity: 0.8 });
      const particles = new THREE.Points(pGeo, pMat);
      particles.visible = false;
      hologramContainer.add(particles);

      // Logic to get color based on current object (match with text color)
      const getObjectColor = (index: number) => {
          return new THREE.Color(0xffffff); // Keep it all white/black and white theme
      };

      const triggerExplosion = () => {
          holoVisible = false;
          currentInnerObject.visible = false;
          particles.visible = true;
          
          const objColor = getObjectColor(currentObjIndex);
          const posArray = particles.geometry.attributes.position.array as Float32Array;
          const colArray = particles.geometry.attributes.color.array as Float32Array;
          
          for(let i=0; i<pCount; i++) {
              posArray[i*3] = (Math.random()-0.5)*0.5;
              posArray[i*3+1] = (Math.random()-0.5)*0.5;
              posArray[i*3+2] = (Math.random()-0.5)*0.5;
              
              // Randomize velocity
              pVel[i].set((Math.random()-0.5)*0.2, (Math.random()-0.5)*0.2, (Math.random()-0.5)*0.2);
              
              colArray[i*3] = objColor.r;
              colArray[i*3+1] = objColor.g;
              colArray[i*3+2] = objColor.b;
          }
          particles.geometry.attributes.position.needsUpdate = true;
          particles.geometry.attributes.color.needsUpdate = true;
      };

      const triggerSpawn = () => {
          holoVisible = true;
          particles.visible = false;
          
          innerObjectsContainer.remove(currentInnerObject);
          currentObjIndex = (currentObjIndex + 1) % innerObjects.length;
          currentInnerObject = innerObjects[currentObjIndex];
          
          currentInnerObject.visible = true;
          currentInnerObject.scale.set(0.1, 0.1, 0.1); 
          targetScale = 1;
          holoScale = 0.1; 
          
          innerObjectsContainer.add(currentInnerObject);
      };

      const isFist = (landmarks: any) => {
        const dist = (p1: any, p2: any) => Math.hypot(p1.x - p2.x, p1.y - p2.y);
        const indexFolded = dist(landmarks[8], landmarks[0]) < dist(landmarks[6], landmarks[0]);
        const middleFolded = dist(landmarks[12], landmarks[0]) < dist(landmarks[10], landmarks[0]);
        const ringFolded = dist(landmarks[16], landmarks[0]) < dist(landmarks[14], landmarks[0]);
        const pinkyFolded = dist(landmarks[20], landmarks[0]) < dist(landmarks[18], landmarks[0]);
        return indexFolded && middleFolded && ringFolded && pinkyFolded;
      };

      let leftHandPos = new THREE.Vector3(0,0,0);
      let targetLeftHandPos = new THREE.Vector3(0,-1,0); 
      let hasLeftHand = false;
      let hasRightHand = false;
      let leftHandCenter = new THREE.Vector3();
      let rightHandCenter = new THREE.Vector3();
      let prevRightFist = false;
      
      let isBoxClosing = false;
      let starRainActive = false;
      let prevHandX: number | null = null;
      
      setLoadingMsg("");

      const hands = new window.Hands({
        locateFile: (file: string) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
        }
      });
      handsObj = hands;

      hands.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.7
      });

      hands.onResults((results: any) => {
        if (isDestroyed) return;

        hasLeftHand = false;
        hasRightHand = false;
        let rightHandFound = false;
        let rightIsFist = false;

        if (results.multiHandLandmarks && results.multiHandedness) {
          for (let i = 0; i < results.multiHandLandmarks.length; i++) {
            const classification = results.multiHandedness[i];
            const isPhysicalLeft = classification.label === 'Right';
            const isPhysicalRight = classification.label === 'Left';

            const landmarks = results.multiHandLandmarks[i];
            const fist = isFist(landmarks);

            if (isPhysicalLeft) {
              hasLeftHand = true;
              const x = (1 - landmarks[9].x) * 2 - 1; 
              const y = -(landmarks[9].y) * 2 + 1;
              const vec = new THREE.Vector3(x, y, 0.5);
              vec.unproject(camera);
              vec.sub(camera.position).normalize();
              const distance = -camera.position.z / vec.z;
              targetLeftHandPos.copy(camera.position).add(vec.multiplyScalar(distance));
              leftHandCenter.set(landmarks[9].x, landmarks[9].y, landmarks[9].z);
            }

            if (isPhysicalRight) {
              hasRightHand = true;
              rightHandFound = true;
              rightIsFist = fist;
              rightHandCenter.set(landmarks[9].x, landmarks[9].y, landmarks[9].z);
            }
          }
        }

        if (hasLeftHand && hasRightHand) {
            const dist = leftHandCenter.distanceTo(rightHandCenter);
            // Threshold for clapping. >0.02 prevents single hand glitching as two, <0.08 requires hands to be very close.
            if (dist > 0.02 && dist < 0.08) { 
                isBoxClosing = true;
            }
        }

        // Swipe detection for star rain
        let currentHandX = null;
        if (hasRightHand) currentHandX = rightHandCenter.x;
        else if (hasLeftHand) currentHandX = leftHandCenter.x;

        if (currentHandX !== null && prevHandX !== null) {
            const velocityX = currentHandX - prevHandX;
            if (Math.abs(velocityX) > 0.08) { 
                starRainActive = true;
                stars.visible = true;
            }
        }
        prevHandX = currentHandX;

        // Gesture Logic for Right Hand
        if (rightHandFound) {
          if (prevRightFist && !rightIsFist) {
            // Closed -> Open = Destroy
            if (holoVisible) triggerExplosion();
          } else if (!prevRightFist && rightIsFist) {
            // Open -> Closed = Next Spawn
            if (!holoVisible) triggerSpawn();
          }
          prevRightFist = rightIsFist;
        }
      });

      let detectionFrameId: number;
      const detect = async () => {
          if (isDestroyed) return;
          if (videoRef.current && videoRef.current.readyState >= 2) {
              await hands.send({image: videoRef.current});
          }
          detectionFrameId = requestAnimationFrame(detect);
      };
      detect();

      let animationFrameId: number;
      let time = 0;

      const animate = () => {
        if (isDestroyed) return;
        animationFrameId = requestAnimationFrame(animate);
        time += 0.02;
        
        // Use fixed time delta for smooth animation regardless of clock issues
        const fixedDelta = 0.016; 
        for(let mixer of mixers) {
            mixer.update(fixedDelta);
        }

        // Position Hologram at left hand if present, otherwise drift to center
        if (isBoxClosing) {
            hologramContainer.scale.lerp(new THREE.Vector3(0, 0, 0), 0.1);
            if (hologramContainer.scale.x < 0.01) {
                hologramContainer.visible = false;
            }
        } else {
            if (hasLeftHand) {
                leftHandPos.lerp(targetLeftHandPos, 0.2);
            } else {
                leftHandPos.lerp(new THREE.Vector3(0, 0, 0), 0.05);
            }
            hologramContainer.position.copy(leftHandPos);
        }

        // Rotate and animate the inner object ONLY
        if(holoVisible) {
            // Smoothly scale up the inner object when spawned
            holoScale += (targetScale - holoScale) * 0.15;
            currentInnerObject.scale.set(holoScale, holoScale, holoScale);

            if(currentInnerObject.userData.update) {
                currentInnerObject.userData.update(time);
            }
        }

        // Bouncing Particles Animation inside the box
        if (particles.visible) {
            const posArray = particles.geometry.attributes.position.array as Float32Array;
            for(let i=0; i<pCount; i++) {
                let x = posArray[i*3] + pVel[i].x;
                let y = posArray[i*3+1] + pVel[i].y;
                let z = posArray[i*3+2] + pVel[i].z;
                
                // Bounce off the box walls (boxSize is 2.5, bounds are -1.25 to 1.25)
                const bound = 1.2; 
                if(x > bound || x < -bound) { pVel[i].x *= -1; x = Math.sign(x)*bound; }
                if(y > bound || y < -bound) { pVel[i].y *= -1; y = Math.sign(y)*bound; }
                if(z > bound || z < -bound) { pVel[i].z *= -1; z = Math.sign(z)*bound; }
                
                posArray[i*3] = x;
                posArray[i*3+1] = y;
                posArray[i*3+2] = z;
            }
            particles.geometry.attributes.position.needsUpdate = true;
        }

        if (starRainActive) {
            const posArray = stars.geometry.attributes.position.array as Float32Array;
            for(let i=0; i<starCount; i++) {
                posArray[i*3+1] -= starVel[i];
                if (posArray[i*3+1] < -10) {
                    posArray[i*3+1] = 20; // reset to top
                }
            }
            stars.geometry.attributes.position.needsUpdate = true;
        }

        renderer.render(scene, camera);
      };
      animate();

      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationFrameId);
        cancelAnimationFrame(detectionFrameId);
        if (mountRef.current) mountRef.current.removeChild(renderer.domElement);
        renderer.dispose();
      };
    };

    let cleanupFn: any = null;
    init().then(cleanup => { cleanupFn = cleanup; });

    return () => {
      isDestroyed = true;
      if (cleanupFn) cleanupFn();
      if (handsObj) handsObj.close();
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  useVoiceCommand({
    "close camera": onClose,
    "next": onClose,
    "close": onClose,
    "band karo": onClose
  });

  return (
    <motion.div 
      className="fixed inset-0 z-[300] bg-black overflow-hidden flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        muted 
        className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1]" 
      />
      
      {/* 3D Hologram Layer */}
      <div ref={mountRef} className="absolute inset-0 z-10" />

      {/* UI Overlay */}
      <div className="absolute top-10 left-0 right-0 z-20 flex justify-center pointer-events-none">
         <h2 className="text-[#00ffff] font-mono text-xl md:text-2xl tracking-[0.3em] uppercase animate-pulse" style={{ textShadow: '0 0 15px #00ffff' }}>
           Real 3D Object Interface
         </h2>
      </div>

      {loadingMsg && (
        <div className="absolute top-1/2 left-0 right-0 z-50 flex justify-center pointer-events-none">
          <h2 className="text-[#00ffff] font-mono text-xl animate-pulse bg-black/50 p-4 rounded-lg border border-[#00ffff] shadow-[0_0_20px_rgba(0,255,255,0.4)]">
            {loadingMsg}
          </h2>
        </div>
      )}

      <div className="absolute bottom-12 z-20 flex justify-center w-full">
        <button 
          onClick={onClose}
          className="px-8 py-3 border border-[#00ffff] text-[#00ffff] font-mono text-lg uppercase tracking-wider bg-black/50 backdrop-blur-md rounded-full hover:bg-[#00ffff]/20 transition-all shadow-[0_0_20px_rgba(0,255,255,0.4)]"
        >
          Close View
        </button>
      </div>
      
      <style>{`
        body { margin: 0; overflow: hidden; }
      `}</style>
    </motion.div>
  );
}
