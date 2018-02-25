import { arrFrom, arrCount, arrRemoveItem } from "lightdash";
import { uriDeckDecode, uriDeckEncode } from "../uriDeck";
import { DECKPARTS } from "../data/deck";
import { CARD_TYPE } from "../data/filters";

const fileToList = function(fileContent) {
    const fileParts = fileContent
        .replace(/#created.+/, "")
        .trim()
        .split(/[#!].+\n?/g)
        .slice(1);

    return DECKPARTS.map((deckPart, index) =>
        fileParts[index]
            .split(/\n\r?/g)
            .map(line => line.trim())
            .filter(line => line.length > 0)
    );
};

const listToText = function(list, cardDb) {
    const result = [];

    DECKPARTS.forEach((deckPart, index) => {
        const deckPartCards = list[index];

        if (deckPartCards.length > 0) {
            const deckPartCardsCounted = arrFrom(
                arrCount(deckPartCards).entries()
            ).map(entry => `${cardDb.getName(entry[0])} x${entry[1]}`);

            result.push(`${deckPart.name}:`, ...deckPartCardsCounted, "");
        }
    });

    return result.join("\n").trim();
};

const sort = (list, cardDb) =>
    list.sort((a, b) => {
        const dataA = cardDb.get(a);
        const dataB = cardDb.get(b);
        const typeComp =
            CARD_TYPE.indexOf(dataA[1]) - CARD_TYPE.indexOf(dataB[1]);
        const lvComp = Number(dataB[4]) - Number(dataA[4]);
        const rcComp = dataA[5].localeCompare(dataB[5]);
        const nameComp = dataA[0].localeCompare(dataB[0]);

        if (typeComp !== 0) {
            return typeComp;
        } else if (lvComp !== 0) {
            return lvComp;
        } else if (rcComp !== 0) {
            return rcComp;
        }

        return nameComp;
    });

const Deck = class {
    constructor(list = [[], [], []], name = "Unnamed") {
        this.name = name;
        this.parts = DECKPARTS;

        this.main = list[0];
        this.extra = list[1];
        this.side = list[2];

        this.all = this.getAll();

        // eslint-disable-next-line no-console
        console.log("CREATED Deck", this);
    }
    static fromUri(uriDeck) {
        return new Deck(uriDeckDecode(uriDeck));
    }
    static fromFile(file) {
        const reader = new FileReader();

        return new Promise((resolve, reject) => {
            reader.onload = e => {
                const name = file.name.replace(".ydk", "");
                const list = fileToList(e.target.result);

                resolve(new Deck(list, name));
            };

            if (file) {
                reader.readAsText(file);
            } else {
                reject(null);
            }
        });
    }
    static fromRemoteFile(uri) {
        return new Promise((resolve, reject) => {
            fetch(uri, {
                mode: "same-origin"
            }).then(res => {
                if (res.ok) {
                    res
                        .text()
                        .then(text => resolve(new Deck(fileToList(text))));
                } else {
                    reject(res);
                }
            });
        });
    }
    toUri() {
        return uriDeckEncode(this.getList());
    }
    toFile() {
        const fileParts = [];

        DECKPARTS.forEach(deckPart => {
            fileParts.push(deckPart.indicator, ...this[deckPart.id], "");
        });

        return new File([fileParts.join("\n").trim()], `${this.name}.ydk`, {
            type: "text/ydk"
        });
    }
    toText(cardDb) {
        return listToText(this.getList(), cardDb);
    }
    cardCanAdd(deckPart, cardId, cardDb) {
        return (
            deckPart.check(cardDb.get(cardId)) &&
            this[deckPart.id].length < deckPart.max &&
            this[deckPart.id].filter(
                activeSectionCardId => activeSectionCardId === cardId
            ).length < 3
        );
    }
    cardAdd(deckPart, cardId, cardDb) {
        if (this.cardCanAdd(deckPart, cardId, cardDb)) {
            this[deckPart.id].push(cardId);
            this.all = this.getAll();
        }
    }
    cardRemove(deckPart, cardId) {
        if (this[deckPart.id].includes(cardId)) {
            this[deckPart.id] = arrRemoveItem(this[deckPart.id], cardId);
            this.all = this.getAll();
        }
    }
    getList() {
        return [this.main, this.extra, this.side];
    }
    getAll() {
        return [...this.main, ...this.extra, ...this.side];
    }
    sort(cardDb) {
        DECKPARTS.forEach(deckPart => {
            this[deckPart.id] = sort(this[deckPart.id], cardDb);
        });
    }
};

export default Deck;
