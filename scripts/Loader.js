export default class Loader{

    constructor(){
        this.resources = new Map();
    }

    loadSources(){
        const sourcesToLoad = [];

        sourcesToLoad.push(this.loadAsJSON("map", "../json/map.json"));

        return Promise.all(sourcesToLoad).then(sources =>{
            sources.forEach(source =>{
                this.resources.set(source.name, source.data);
            });
        }).catch(() => "Could not load data!")
    }

    async loadAsJSON(name, url){
        return {name, data: await fetch(url).then(k => k.json()).then(res => res) };
    }

    async load(name, url){
        return {name, data: await fetch(url).then(k => k.blob()).then(res => res) };
    }

}