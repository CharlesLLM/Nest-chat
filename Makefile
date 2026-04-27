DOCKER := $(shell which docker)
COMPOSE := $(DOCKER) compose
BACK = cd back && 
FRONT = cd front && 

.PHONY: help docker-up docker-stop back-start front-start install db

docker-up:
	$(COMPOSE) up -d

docker-stop:
	$(COMPOSE) stop

back-start:
	$(BACK) npm run start:dev

front-start:
	$(FRONT) npm run dev

install:
	$(BACK) npm install
	$(FRONT) npm install

db:
	$(BACK) npx prisma generate
	$(BACK) npx prisma migrate dev
