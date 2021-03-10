@echo off

::MAIN: deletes all "obj" subdirectories
        call:RECURSIVE_PURGE .vs
	call:RECURSIVE_PURGE .intermediateOutput
	call:RECURSIVE_PURGE output.*
goto:EOF //return

:RECURSIVE_PURGE
:: parameter: %1 - simple name of subdirectory to purge and delete recursively
	for /d /r %%d in (%1) do call:PURGE %%d
goto:EOF //return

:PURGE
:: parameter: %1 full or relative directory name to purge and remove
	del /s /q %1\*.*
	rmdir /s /q %1
goto:EOF //return
