export default {
    clearExmpl: {
        populate: '',
        fields: [],
        searchOr: [],
        sort: '',
    },

    user: {
        populate: '',
        fields: [
            'actualName',
            'login',
            'name',
            'lastName',
            'email',
            'balance',
            'phone',
            'photo',
            'registryDate',
            'isBuisnessOwner',
            'isBanned',
        ],
        searchOr: [
            'name',
            'login',
            'email',
            'actualName',
            'phone'
        ],
        sort: '-registryDate',
    },

    admin: {
        populate: '',
        fields: '',
        searchOr: [],
        sort: '',
    },

    settings: {
        populate: '',
        fields: '',
        searchOr: [],
        sort: '',
    },

    tariffs: {
        populate: '',
        fields: '',
        searchOr: [],
        sort: '',
    },

    accruals: {
        populate: 'userId siteId',
        fields: '',
        searchOr: [
            'number',
            'description',
            'userId.login',
        ],
        sort: '',
    },

    bills: {
        populate: 'sender',
        fields: [
            'sale',
            'summ',
            'term',
            'tariff',
            'sender',
            'createdDate',
            'isPaymed',
        ],
        searchOr: [],
        sort: '-createdDate',
    },

};
