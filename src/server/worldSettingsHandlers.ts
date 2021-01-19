import { StarterPlayer } from "@rbxts/services";
import CollisionManager from "./CollisionManager";

export const CollisionsEnabled = (newValue: boolean) => CollisionManager.setCollision(newValue);

export const DefaultWalkSpeed = (newValue: number) => (StarterPlayer.CharacterWalkSpeed = newValue);

export const DefaultJumpPower = (newValue: number) => (StarterPlayer.CharacterJumpPower = newValue);

export const MinCameraZoom = (newValue: number) => (StarterPlayer.CameraMinZoomDistance = newValue);

export const MaxCameraZoom = (newValue: number) => (StarterPlayer.CameraMaxZoomDistance = newValue);
