@echo off

IF %1 == rojo ( echo Serving rojo files && rojo serve
) ELSE IF %1 == remodel ( echo Adding models && remodel run add-models.lua
) ELSE IF %1 == build ( echo Compiling roblox-ts && rbxtsc
) ELSE IF %1 == rojo_build ( echo Building place && rojo build -o dist/WorldTemplate.rbxlx
) ELSE IF %1 == build_place ( run rojo_build && run remodel
) ELSE IF %1 == test_serve ( run build && run rojo
) ELSE IF %1 == test ( run build && run build_place
) ELSE IF %1 == eslint_fix ( eslint src --fix
) ELSE (
	echo [ERROR] Command Not Found: %1
)