export default identity<Record<PermissionTypes, Permissions>>({
	TeamBlocko: {
		Inherit: "Owner",
	},
	Owner: {
		TransferOwnership: true,
		Inherit: "Admin",
	},
	Admin: {
		ManagePermissions: true,
		Inherit: "Builder",
	},
	Builder: {
		Build: true,
	},
	Visitor: {},
});
