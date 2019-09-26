"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = async (event, context) => {
    const config = JSON.parse(process.env
        .GEOPROCESSING_CONFIG);
    const services = Object.keys(config.services).map(title => ({
        id: title,
        location: `${process.env.SERVICE_URL}/${title}`,
        executionMode: config.services[title].executionMode || "sync",
        timeout: config.services[title].timeout,
        requiresAttributes: config.services[title].requiresAttributes || []
    }));
    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify({
            location: process.env.SERVICE_URL,
            published: config.publishedDate,
            apiVersion: config.apiVersion,
            clientUri: config.clientUri,
            title: config.title,
            description: config.description,
            author: config.author,
            relatedUrl: config.relatedUri,
            services,
            clients: Object.keys(config.clients).map(title => ({
                title,
                description: config.clients[title].description,
                tabs: Object.keys(config.clients[title].tabs).map(tabTitle => ({
                    id: tabTitle,
                    title: config.clients[title].tabs[tabTitle].title || tabTitle,
                    requiredServices: (config.clients[title].tabs[tabTitle].requiredServices || []).map(title => services.find(s => s.id === title))
                }))
            }))
        })
    };
};
