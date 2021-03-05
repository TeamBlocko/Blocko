export default [
	{
		"Name": "Damager",
		"Properties": {
			"Damage": {
				"Name": "Damage",
				"Type": "number",
				"Default": 50,
				"Min": 1,
				"Max": 100,
				"Current": 50,
			},
			"Cooldown": {
				"Name": "Cooldown",
				"Type": "number",
				"Default": 1,
				"Min": 1,
				"Max": 10,
				"Current": 1,
			}
		},
		"Multiple": false
	},
	{
		"Name": "Conveyor",
		"Properties": {
			"Speed": {
				"Name": "Speed",
				"Type": "number",
				"Default": 1,
				"Min": 1,
				"Max": 10,
				"Current": 1,
			}
		},
		"Multiple": true
	},
	{
		"Name": "Tripper",
		"Properties": {},
		"Multiple": false
	}
] as Functionality[]