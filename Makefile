.PHONY: build, dev, push, d_build, d_run, d_rebuild

full_setup_dev:
	docker-compose --env-file .env.development up --build -d

full_setup_prod:
	docker-compose --env-file .env.production up --build -d

resetup_dev:
	docker-compose --env-file .env.development down --volumes --remove-orphans
	docker-compose --env-file .env.development up --build --force-recreate -d

resetup_prod:
	docker-compose --env-file .env.production down --volumes --remove-orphans
	docker-compose --env-file .env.production up --build --force-recreate -d

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