import { RESOURCES_ROUTE } from "../globals/globals.js";

export default class Loader
{
    #sourceRoute = RESOURCES_ROUTE;

    constructor()
    {
        this.resources = new Map();
    }

    get sourceRoute()
    {
        return this.#sourceRoute;
    }

    set sourceRoute(sourceRoute)
    {
        this.#sourceRoute = sourceRoute;
    }

    async loadSources(sourcesToLoad)
    {
        try {
            (await Promise.all(sourcesToLoad)).forEach(source => this.resources.set(source.name, source.data));
            
            return this.resources;
        } catch {
            return "Could not load data!";
        }
    }

    async load(name, url)
    {
        return { name, data: await fetch(`${this.sourceRoute}/${url}`).then(k => k.blob()).then(res => res) };
    }

    async loadAsJSON(name, url)
    {
        return { name, data: await fetch(`${this.sourceRoute}/${url}`).then(k => k.json()).then(res => res) };
    }

}