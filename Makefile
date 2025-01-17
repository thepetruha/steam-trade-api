.PHONY: build, dev, push, d_build, d_run, d_rebuild

dev:
	npm run dev
clear_modules:
	sudo rm -rf node_modules package-lock.json
push:
	git pull && git add . && git commit -m "$(filter-out $@,$(MAKECMDGOALS))" && git push 
pull:
	git pull
%:
	@: