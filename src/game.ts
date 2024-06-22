import * as BABYLON from '@babylonjs/core';
import { GridMaterial } from '@babylonjs/materials';

const KEY_ARROW_UP = 38;
const KEY_ARROW_DOWN = 40;
const KEY_ARROW_LEFT = 37;
const KEY_ARROW_RIGHT = 39;
const KEY_W = 87;
const KEY_S = 83;
const KEY_A = 65;
const KEY_D = 68;
const KEY_SPACE = 32;
const KEY_PAGE_UP = 33;
const KEY_PAGE_DOWN = 34;

const PLAYER_POSTION_Y_OFFSET = 1;
const PLAYER_MOVE_SPEED = 3;

const GRAVITY = -9.81;
const JUMP_VELOCITY = 5;

const CAMERA_ROTATION_SPEED = 2;
const CAMERA_ZOOM_SPEED = 2;
const FOG_STRECH_SPEED = 10;

export class Game {
  canvas: HTMLCanvasElement;
  engine: BABYLON.Engine;
  scene: BABYLON.Scene;

  clearColor: BABYLON.Color3;
  deviceSourceManager: BABYLON.DeviceSourceManager;

  camera: BABYLON.TargetCamera;
  cameraHeight: number = 1.5;
  cameraRadius: number = 4;
  cameraTargetHeight: number = 0.5;
  cameraAlpha: number = 0;
  cameraBeta: number = Math.PI;

  player: BABYLON.Mesh;
  playerSoleRay: BABYLON.Ray;
  playerSoleNormalRay: BABYLON.Ray;
  playerVelocityY: number = 0;
  isPlayerJumping: boolean = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.engine = new BABYLON.Engine(canvas, true);
    this.scene = new BABYLON.Scene(this.engine);

    this.clearColor = new BABYLON.Color3(this.scene.clearColor.r, this.scene.clearColor.g, this.scene.clearColor.b);
    this.deviceSourceManager = new BABYLON.DeviceSourceManager(this.engine);

    this.BuildScene();

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }

  BuildScene(): void {
    // camera
    this.camera = new BABYLON.TargetCamera('camera', new BABYLON.Vector3(0, this.cameraHeight, -this.cameraRadius));
    this.camera.setTarget(new BABYLON.Vector3(0, this.cameraTargetHeight, 0));

    // light
    const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0));
    light.intensity = 0.5;

    // fog
    this.scene.fogMode = BABYLON.Scene.FOGMODE_LINEAR;
    this.scene.fogColor = this.clearColor;
    this.scene.fogStart = 100;
    this.scene.fogEnd = 200;

    this.CreateGround();

    this.CreatePlayerRay();
    this.CreatePlayer();
    this.CreatePlayerNose();

    this.CreateBlock1();
    this.CreateBlock2();
    this.CreateBlock3();
    this.CreateBlock4('block4a', -6, -0.8, -6);
    this.CreateBlock4('block4b', -6, -0.6, -4);
    this.CreateBlock4('block4c', -6, -0.4, -2);
    this.CreateBlock4('block4d', -6, -0.6, 0);
    this.CreateBlock4('block4e', -6, -0.8, 2);
    this.CreateBlock5();
    this.CreateHeightMap();

    this.Update();
  }

  CreateGround(): void {
    const mesh = BABYLON.MeshBuilder.CreateGround('ground', { width: 10000, height: 10000 });
    mesh.rotationQuaternion = BABYLON.Quaternion.Identity();

    const material = new GridMaterial('ground');
    material.majorUnitFrequency = 10;
    material.minorUnitVisibility = 0.4;
    material.gridRatio = 1;
    material.backFaceCulling = false;
    material.mainColor = this.clearColor;
    material.lineColor = new BABYLON.Color3(0.73, 0.73, 0.76);
    material.opacity = 1;
    mesh.material = material;
  }

  CreatePlayerRay(): void {
    this.playerSoleRay = new BABYLON.Ray(new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(0, -1, 0), 1.01);
    BABYLON.RayHelper.CreateAndShow(this.playerSoleRay, this.scene, new BABYLON.Color3(1, 0, 0));

    this.playerSoleNormalRay = new BABYLON.Ray(new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(1, 0, 0), 1);
    BABYLON.RayHelper.CreateAndShow(this.playerSoleNormalRay, this.scene, new BABYLON.Color3(0, 1, 0));
  }

  CreatePlayer(): void {
    this.player = BABYLON.MeshBuilder.CreateBox('player', { width: 1, height: 2, depth: 1 });
    this.player.position.y = PLAYER_POSTION_Y_OFFSET;
    this.player.rotationQuaternion = BABYLON.Quaternion.Identity();

    const material = new BABYLON.StandardMaterial('player');
    material.diffuseColor = new BABYLON.Color3(1, 0, 0);
    material.alpha = 0.5;
    this.player.material = material;
  }

  CreatePlayerNose(): void {
    const mesh = BABYLON.MeshBuilder.CreateBox('nose', { width: 0.3, height: 0.3, depth: 0.3 });
    mesh.position = new BABYLON.Vector3(0, 0.5, 0.65);
    mesh.parent = this.player;

    const material = new BABYLON.StandardMaterial('nose');
    material.diffuseColor = new BABYLON.Color3(1, 0, 0);
    material.alpha = 0.5;
    mesh.material = material;
  }

  CreateBlock1(): void {
    const mesh = BABYLON.MeshBuilder.CreateBox('block1', { width: 1000, height: 10, depth: 1000 });
    mesh.position = new BABYLON.Vector3(0, -5, 10);
    mesh.rotationQuaternion = BABYLON.Quaternion.Identity();
    mesh.rotate(BABYLON.Vector3.Right(), -10 * Math.PI / 180);

    const material = new GridMaterial('block1');
    material.majorUnitFrequency = 10;
    material.minorUnitVisibility = 0.4;
    material.gridRatio = 1;
    material.backFaceCulling = true;
    material.mainColor = this.clearColor;
    material.lineColor = new BABYLON.Color3(0.76, 0.73, 0.76);
    material.opacity = 1;
    mesh.material = material;
  }

  CreateBlock2(): void {
    const mesh = BABYLON.MeshBuilder.CreateBox('block2', { width: 2, height: 2, depth: 2 });
    mesh.position = new BABYLON.Vector3(6, -0.6, -6);
    mesh.rotationQuaternion = BABYLON.Quaternion.Identity();

    const material = new GridMaterial('block2');
    material.majorUnitFrequency = 10;
    material.minorUnitVisibility = 0.4;
    material.gridRatio = 1;
    material.backFaceCulling = true;
    material.mainColor = this.clearColor;
    material.lineColor = new BABYLON.Color3(0.76, 0.73, 0.76);
    material.opacity = 1;
    mesh.material = material;
  }

  CreateBlock3(): void {
    const mesh = BABYLON.MeshBuilder.CreateBox('block3', { width: 2, height: 2, depth: 10 });
    mesh.position = new BABYLON.Vector3(6, -1.050, -0.1);
    mesh.rotationQuaternion = BABYLON.Quaternion.Identity();
    mesh.rotate(BABYLON.Vector3.Right(), 5 * Math.PI / 180);

    const material = new GridMaterial('block3');
    material.majorUnitFrequency = 10;
    material.minorUnitVisibility = 0.4;
    material.gridRatio = 1;
    material.backFaceCulling = true;
    material.mainColor = this.clearColor;
    material.lineColor = new BABYLON.Color3(0.76, 0.73, 0.76);
    material.opacity = 1;
    mesh.material = material;
  }

  CreateBlock4(name: string, posx: number, posy: number, posz: number): void {
    const mesh = BABYLON.MeshBuilder.CreateBox(name, { width: 2, height: 2, depth: 2 });
    mesh.position = new BABYLON.Vector3(posx, posy, posz);
    mesh.rotationQuaternion = BABYLON.Quaternion.Identity();

    const material = new GridMaterial(name);
    material.majorUnitFrequency = 10;
    material.minorUnitVisibility = 0.4;
    material.gridRatio = 1;
    material.backFaceCulling = true;
    material.mainColor = this.clearColor;
    material.lineColor = new BABYLON.Color3(0.76, 0.73, 0.76);
    material.opacity = 1;
    mesh.material = material;
  }

  CreateBlock5(): void {
    const mesh = BABYLON.MeshBuilder.CreateBox('block5', { width: 4, height: 0, depth: 4 });
    mesh.position = new BABYLON.Vector3(3, -0.2, 5);
    mesh.rotationQuaternion = BABYLON.Quaternion.Identity();
    mesh.rotate(BABYLON.Vector3.Forward(), 10 * Math.PI / 180);

    const material = new GridMaterial('block5');
    material.majorUnitFrequency = 10;
    material.minorUnitVisibility = 0.4;
    material.gridRatio = 1;
    material.backFaceCulling = true;
    material.mainColor = this.clearColor;
    material.lineColor = new BABYLON.Color3(0.76, 0.73, 0.76);
    material.opacity = 1;
    mesh.material = material;
  }

  CreateHeightMap(): void {
    const mesh = BABYLON.MeshBuilder.CreateGroundFromHeightMap('heightmap', './assets/textures/heightmap.png', {
      width: 30, height: 30, subdivisions: 10, maxHeight: 1
    });
    mesh.position.x = -20;
    mesh.rotationQuaternion = BABYLON.Quaternion.Identity();

    const material = new GridMaterial('heightmap');
    material.majorUnitFrequency = 10;
    material.minorUnitVisibility = 0.4;
    material.gridRatio = 1;
    material.backFaceCulling = true;
    material.mainColor = this.clearColor;
    material.lineColor = new BABYLON.Color3(0.76, 0.73, 0.76);
    material.opacity = 1;
    mesh.material = material;
  }

  Update(): void {
    this.scene.registerBeforeRender(() => {
      this.UpdatePlayer();
      this.UpdateCamera();
    });
  }

  UpdatePlayer(): void {
    const delta = this.scene.getEngine().getDeltaTime() / 1000;

    // ray
    this.playerSoleRay.origin = this.player.position;

    const pickingInfo = this.scene.pickWithRay(this.playerSoleRay, mesh => {
      const reg = new RegExp(/ground|block*|heightmap/);
      return reg.test(mesh.name);
    });

    if (pickingInfo.hit) {
      this.player.position.y = PLAYER_POSTION_Y_OFFSET + pickingInfo.pickedPoint.y;

      this.isPlayerJumping = false;
      this.playerVelocityY = 0;

      this.playerSoleNormalRay.origin = pickingInfo.pickedPoint;
      this.playerSoleNormalRay.direction = pickingInfo.getNormal().applyRotationQuaternion(pickingInfo.pickedMesh.rotationQuaternion);
    } else {
      this.playerVelocityY += GRAVITY * delta;
      this.player.position.y += this.playerVelocityY * delta;
    }

    // key
    if (this.deviceSourceManager.getDeviceSource(BABYLON.DeviceType.Keyboard)) {

      if (this.deviceSourceManager.getDeviceSource(BABYLON.DeviceType.Keyboard).getInput(KEY_W) == 1) {
        const base = new BABYLON.Vector3(PLAYER_MOVE_SPEED * delta, 0, 0);
        const cameraQuaternion = BABYLON.Quaternion.FromEulerAngles(0, this.cameraAlpha, 0);
        const applyCameraDirection = base.applyRotationQuaternion(cameraQuaternion);
        const applyNormallDirection = BABYLON.Vector3.Cross(applyCameraDirection, this.playerSoleNormalRay.direction);

        const newPosition = this.player.position.add(applyNormallDirection);
        this.player.position = newPosition;
        this.player.rotationQuaternion = cameraQuaternion;
      }

      if (this.deviceSourceManager.getDeviceSource(BABYLON.DeviceType.Keyboard).getInput(KEY_S) == 1) {
        const base = new BABYLON.Vector3(PLAYER_MOVE_SPEED * delta, 0, 0);
        const cameraQuaternion = BABYLON.Quaternion.FromEulerAngles(0, this.cameraAlpha + Math.PI, 0);
        const applyCameraDirection = base.applyRotationQuaternion(cameraQuaternion);
        const applyNormallDirection = BABYLON.Vector3.Cross(applyCameraDirection, this.playerSoleNormalRay.direction);

        const newPosition = this.player.position.add(applyNormallDirection);
        this.player.position = newPosition;
        this.player.rotationQuaternion = cameraQuaternion;
      }

      if (this.deviceSourceManager.getDeviceSource(BABYLON.DeviceType.Keyboard).getInput(KEY_A) == 1) {
        const base = new BABYLON.Vector3(PLAYER_MOVE_SPEED * delta, 0, 0);
        const cameraQuaternion = BABYLON.Quaternion.FromEulerAngles(0, this.cameraAlpha - (Math.PI / 2), 0);
        const applyCameraDirection = base.applyRotationQuaternion(cameraQuaternion);
        const applyNormallDirection = BABYLON.Vector3.Cross(applyCameraDirection, this.playerSoleNormalRay.direction);

        const newPosition = this.player.position.add(applyNormallDirection);
        this.player.position = newPosition;
        this.player.rotationQuaternion = cameraQuaternion;
      }

      if (this.deviceSourceManager.getDeviceSource(BABYLON.DeviceType.Keyboard).getInput(KEY_D) == 1) {
        const base = new BABYLON.Vector3(PLAYER_MOVE_SPEED * delta, 0, 0);
        const cameraQuaternion = BABYLON.Quaternion.FromEulerAngles(0, this.cameraAlpha + (Math.PI / 2), 0);
        const applyCameraDirection = base.applyRotationQuaternion(cameraQuaternion);
        const applyNormallDirection = BABYLON.Vector3.Cross(applyCameraDirection, this.playerSoleNormalRay.direction);

        const newPosition = this.player.position.add(applyNormallDirection);
        this.player.position = newPosition;
        this.player.rotationQuaternion = cameraQuaternion;
      }

      if (this.deviceSourceManager.getDeviceSource(BABYLON.DeviceType.Keyboard).getInput(KEY_ARROW_UP) == 1) {
        this.cameraBeta += CAMERA_ROTATION_SPEED * delta;
      }
      if (this.deviceSourceManager.getDeviceSource(BABYLON.DeviceType.Keyboard).getInput(KEY_ARROW_DOWN) == 1) {
        this.cameraBeta -= CAMERA_ROTATION_SPEED * delta;
      }
      if (this.deviceSourceManager.getDeviceSource(BABYLON.DeviceType.Keyboard).getInput(KEY_ARROW_LEFT) == 1) {
        this.cameraAlpha -= CAMERA_ROTATION_SPEED * delta;
      }
      if (this.deviceSourceManager.getDeviceSource(BABYLON.DeviceType.Keyboard).getInput(KEY_ARROW_RIGHT) == 1) {
        this.cameraAlpha += CAMERA_ROTATION_SPEED * delta;
      }

      if (this.deviceSourceManager.getDeviceSource(BABYLON.DeviceType.Keyboard).getInput(KEY_PAGE_UP) == 1) {
        this.cameraHeight -= CAMERA_ZOOM_SPEED * delta;
        this.cameraRadius -= CAMERA_ZOOM_SPEED * 3 * delta;
        this.cameraTargetHeight -= CAMERA_ZOOM_SPEED * delta;
        this.scene.fogStart -= FOG_STRECH_SPEED * delta;
        this.scene.fogEnd -= FOG_STRECH_SPEED * delta;
      }
      if (this.deviceSourceManager.getDeviceSource(BABYLON.DeviceType.Keyboard).getInput(KEY_PAGE_DOWN) == 1) {
        this.cameraHeight += CAMERA_ZOOM_SPEED * delta;
        this.cameraRadius += CAMERA_ZOOM_SPEED * 3 * delta;
        this.cameraTargetHeight += CAMERA_ZOOM_SPEED * delta;
        this.scene.fogStart += FOG_STRECH_SPEED * delta;
        this.scene.fogEnd += FOG_STRECH_SPEED * delta;
      }

      if (this.deviceSourceManager.getDeviceSource(BABYLON.DeviceType.Keyboard).getInput(KEY_SPACE) == 1) {
        if (!this.isPlayerJumping) {
          this.isPlayerJumping = true;
          this.playerVelocityY = JUMP_VELOCITY;
          this.player.position.y += this.playerVelocityY * delta;
        }
      }
    }
  }

  UpdateCamera(): void {
    const newCamera = new BABYLON.Vector3(0, 0, this.cameraRadius);
    const newCameraQuaternion = BABYLON.Quaternion.FromEulerAngles(this.cameraBeta, this.cameraAlpha, 0);
    const newCameraPosition = newCamera.applyRotationQuaternion(newCameraQuaternion);

    this.camera.position.x = this.player.position.x + newCameraPosition.x;
    this.camera.position.y = this.player.position.y + newCameraPosition.y + this.cameraHeight;
    this.camera.position.z = this.player.position.z + newCameraPosition.z;
    this.camera.setTarget(new BABYLON.Vector3(this.player.position.x, this.player.position.y + this.cameraTargetHeight, this.player.position.z));
  }
}
