# ICO
## Ставим зависимости
`npm install -g ts-node pug-cli typescript@2.3.4 @angular/cli`
`npm install && npm install --dev`
`npm run init:dev`

## Запуск сервера в дев
`sudo npm run dev:server`

## Запуск дев сборки для клиента 
`sudo ng build --watch`

## Запуск дев сборки для cms 
`sudo ng build --watch --app=cms`

## Сборка в продакшн 
`npm run build:prod`

## Создание нового компонента
`ng generate component component-name`

## Создание новой дерективы
`ng generate directive/pipe/service/class/module`.

## Запуск unit тестов
`ng test` [Karma](https://karma-runner.github.io).

## Запуск end-to-end тестов
`ng e2e` [Protractor](http://www.protractortest.org/). `ng serve`.

## TODO
Собирать все js в один и минифицировать его