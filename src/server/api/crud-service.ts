import * as validate from '../services/validateToken';
import types from '../utils/entryTypes';
const uuid = require('uuid');
import * as _ from 'lodash';
import * as moment from 'moment';

export class Crud {
    model: any;
    entryType: string;

    constructor(model: any, entryType: string) {
        this.model = model;
        this.entryType = entryType;
    }

    /**
     * Создание нового элемента
     */
    create = async (ctx, next) => {
        if (await validate.validateToken(ctx.headers.authorization)) {
            ctx.body = await this.model.create(ctx.request.body);
        } else {
            ctx.status = 401;
        }

        await next();
    }

    /**
     * Удаление элемента
     */
    delete = async (ctx, next) => {
        if (await validate.validateToken(ctx.headers.authorization)) {
            ctx.body = await this.model.remove({_id: ctx.params.id });
        } else {
            ctx.status = 401;
        }

        await next();
    }

    /**
     * Получение элемента по идинтификатору.
     * Популяция по внутренним полям
     */
    show = async (ctx, next) => {
        if (await validate.validateToken(ctx.headers.authorization)) {
            ctx.body = await this.model
                .findById(ctx.params.id)
                .select(types[this.entryType].fields)
                .populate(types[this.entryType].populate);
        } else {
            ctx.status = 401;
        }

        await next();
    }

    /**
     * Список элементов коллекции.
     * Поддержка запроса поиска по полям
     */
    list = async (ctx, next) => {
        let query;
        if (ctx.query && ctx.query.query) {
            query = JSON.parse(ctx.query.query);
            Object.keys(query).forEach(key => {
                if (typeof query[key] === 'object') {
                    Object.keys(query[key]).forEach(subKey => {
                        this.normalizeQueryField(query[key], subKey);
                    });
                    if (Object.keys(query[key]).length === 0) {
                        delete query[key];
                    }
                } else {
                    this.normalizeQueryField(query, key);
                }
            });

        }

        if (await validate.validateToken(ctx.headers.authorization)) {
            ctx.body = await this.model
                .find(query)
                .select(types[this.entryType].fields)
                .populate(types[this.entryType].populate)
                .sort(types[this.entryType].sort);
        } else {
            ctx.status = 401;
        }

        await next();
    }

    update = async (ctx, next) => {
        const updatedItem = JSON.parse(ctx.request.body.data);
        ctx.body = await this.model.update({_id: ctx.params.id}, updatedItem);
        await next();
    }

    /**
     * Нормализация полей запроса для поиска по коллекции
     * @param {Object} obj объект запроса
     * @param {String} key поле запроса
     */
    normalizeQueryField = (obj, key) => {
        if (obj[key] === '' || obj[key] === null) {
            delete obj[key];
        }

        if (obj[key] === 'false') {
            obj[key] = false;
        }

        if (obj[key] === 'true') {
            obj[key] = true;
        }

        if (key === '$or') {
            const orFilds = types[this.entryType].searchOr.map((field) => {
                return { [field]: new RegExp(obj[key], 'i')};
            });
            obj[key] = orFilds;
        }

        if (typeof obj[key] === 'string') {
            const isDate = obj[key].match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);

            if (isDate) {
                obj[key] = moment(obj[key]);
                if (key === '$lte') {
                    obj[key].hour(23).minute(59);
                }
                if (key === '$gte') {
                    obj[key].hour(0).minute(0);
                }
            }
        }

    }

};
