import {AxiosServices} from "../core/Axios.Services";
import {Routes} from "../routes/Routes";
import {Axios} from "axios";
import {InterfacesRequest} from "../routes/InterfacesRequest";
import {InterfaceResponse} from "../core/InterfaceResponse";
import {InterfaceScraped} from "./InterfaceScraped";

export class ApexScraper {
    private readonly axiosServices: AxiosServices;
    private readonly routes: Routes
    private userData;
    private parseData: InterfaceResponse;
    private formatPlayerData: InterfaceScraped;
    private respawnPoint:string;
    constructor() {
        this.axiosServices = new AxiosServices(new Axios(), new Routes());
        this.parseData = {
            rankScore: {
                rank: null,
                percentile: null,
                displayName: "",
                displayCategory: "",
                category: null,
                metadata: {
                    iconUrl: "",
                    rankName: "",
                },
                value: null,
                displayValue: "",
                displayType: ""
            }
        }
        this.formatPlayerData = {
            rank: "",
            respawnPoint: null
        };
    }

    async playerDataRetrieve(value: InterfacesRequest): Promise<string> {
        this.axiosServices.playerStatRoute = await value;
        this.respawnPoint = value.respawnPoint
        await this.axiosServices.carreerStatApexPlayer.then(async result => {
            this.userData = await JSON.parse(result.data as unknown as string);
            try {
                this.parseData.rankScore = await this.userData.data.segments[0].stats.rankScore;
            }
            catch (e){
                console.log(e);
                this.parseData = undefined;
            }
        });
        if (this.parseData === undefined) {
            return "Not Found"
        } else {
            return this.formatString();
        }
    }

    parsePlayerData(): InterfaceScraped {
        this.formatPlayerData.rank = this.parseData.rankScore.metadata.rankName;
        this.formatPlayerData.respawnPoint = this.parseData.rankScore.displayValue;
        return this.formatPlayerData;
    }

    formatString(): string {
        return `[${this.parsePlayerData().rank}]${this.respawnPoint ==="true"? " - "+this.parsePlayerData().respawnPoint+"RP":""}`
    }
}