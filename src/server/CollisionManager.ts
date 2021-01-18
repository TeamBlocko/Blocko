import { PhysicsService, Players } from "@rbxts/services";

class CollisionManager {
	public readonly playerCollisionGroupName = "Players";
	public readonly previousCollisionGroups: Map<BasePart, number | undefined> = new Map();

	constructor() {
		PhysicsService.CreateCollisionGroup(this.playerCollisionGroupName)
	
		Players.PlayerAdded.Connect((player) => player.CharacterAdded.Connect((character) => this.onCharacterAdded(character)))
	}

	setCollisionGroup(object: Instance) {
		if (object.IsA("BasePart")) {
			this.previousCollisionGroups.set(object, object.CollisionGroupId)
			PhysicsService.SetPartCollisionGroup(object, this.playerCollisionGroupName)
		}
	}

	setCollisionGroupRecursive(object: Instance) {
		this.setCollisionGroup(object)

		for (const child of object.GetChildren())
			this.setCollisionGroupRecursive(child as BasePart)
	}

	resetCollisionGroup(object: Instance) {
		if (!object.IsA("BasePart"))
			return

		const previousCollisionGroupId = this.previousCollisionGroups.get(object)

		if (!previousCollisionGroupId)
			return

		const previousCollisionGroupName = PhysicsService.GetCollisionGroupName(previousCollisionGroupId)

		if (!previousCollisionGroupName)
			return
		PhysicsService.SetPartCollisionGroup(object, previousCollisionGroupName)
		this.previousCollisionGroups.set(object, undefined)
	}

	onCharacterAdded(character: Model) {
		this.setCollisionGroupRecursive(character)

		character.DescendantAdded.Connect((object) => this.setCollisionGroup(object))
		character.DescendantRemoving.Connect((object) => this.resetCollisionGroup(object))
	}

	setCollision(newValue: boolean) {
		PhysicsService.CollisionGroupSetCollidable(this.playerCollisionGroupName, this.playerCollisionGroupName, newValue)		
	}
}

export default new CollisionManager();
