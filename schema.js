const joi = require("joi");
module.exports.listingSchema = joi.object({
    listing: joi.object({
        title:joi.string().required(),
        description:joi.string().required(),
        country:joi.string().required(),
        price:joi.number().required().min(1),
        location:joi.string().required(),
        image:joi.object({
            url:joi.string().allow('',null),
            filename:joi.string(),
        }),
    }).required(),
});