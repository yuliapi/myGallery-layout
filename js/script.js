const smallBreak = 800;
const largeBreak = 1200;
const smallScreenRowCount = 3;
const largeScreenRowCount = 5;
const itemsInPeriod = 15;

let viewport;
window.onload = function () {
    viewport = window.innerWidth;
};
function validate() {
    return false;
}
function firstByClass(parent, selector) {
    let div = parent.getElementsByClassName(selector);
    return div[0]
}
class DisplayUtils {
    static createClasses(n, mod) {
        let t;
        if (n < 15) {
            t = "gallery-item item" + n;
        }
        if (mod === 0) {
            t = "gallery-item item15"
        }
        else {
            t = "gallery-item item" + mod;
        }
        if (this.isVertical(mod, n)) {
            t = t + " vertical"
        }
        if (this.isSmallVertical(mod)) {
            t = t + " vertical-normal push-left"
        }
        if (mod === 5 || mod === 11 || mod === 12) {
            t = t + " push-right"
        }
        if (this.isLargeVertical(mod)) {
            t = t + " normal-vertical  push-right"
        }
        if (this.isNinthItem(mod)) {
            t = t + " vertical-normal"
        }
        return t
    };

    static isVertical(mod, n) {
        return mod === 3 || n === 15 || (n - 15) / 15 % 1 === 0;
    }

    static isLargeVertical(mod) {
        return mod === 6;
    }

    static isSmallVertical(mod) {
        return (mod === 4 || mod === 10)
    }

    static isNinthItem(mod) {
        return mod === 9
    }

    static createNode(type, classList, text) {
        const node = document.createElement(type);
        if (classList) {
            node.setAttribute("class", classList);
        }
        if (text) {
            node.innerHTML = text
        }
        return node
    }
    static isViewportSmall() {
        return viewport > smallBreak && viewport < largeBreak
    }
    static isViewportLarge() {
        return viewport >= largeBreak
    }

}

class ServerEntry {
    constructor(id) {
        this.id = id;
        this.text = '#' + id;
    }

    getJson() {
        return {"id": this.id, "text": [this.text]};
    };
}

class DisplayEntry {
    constructor(entry, totalEntriesCount) {
        this.entry = entry;
        // this.id = entry.id;
        // this.text = entry.text;
        this.totalEntriesCount = totalEntriesCount;
        this.template = document.getElementById('galleryItemInner').innerHTML;
        // this.photo = entry.photo;
        // this.photoWidth = entry.photoWidth;
        // this.photoHeight = entry.photoHeight;
        // this.number = this.entry.id + 1;
        this.title = entry.title
    }

    display(generalContainer, lastRowContainer) {
        let totalMod = 0;
        let needExtraRow = false;
        if (DisplayUtils.isViewportSmall()) {
            totalMod = (this.totalEntriesCount % itemsInPeriod) % smallScreenRowCount;
            if (totalMod < smallScreenRowCount) {
                needExtraRow = true;
            }
        }
        if (DisplayUtils.isViewportLarge()) {
            totalMod = (this.totalEntriesCount % itemsInPeriod) % largeScreenRowCount;
            if (totalMod < largeScreenRowCount - 1) { /*on large screen with max 5 items in a row  only 4 filled is ok and don't require last row*/
                needExtraRow = true;
            }
        }

        let num = this.entry.id + 1;
        let mod = num % itemsInPeriod;

        let box = DisplayUtils.createNode('div', "box", num);
        if (needExtraRow && this.entry.id >= this.totalEntriesCount - totalMod) {
            if (generalContainer.clientWidth) {
                lastRowContainer.style.width = generalContainer.clientWidth + "px";
            }
            let wrapper = DisplayUtils.createNode('div', "gallery-item");
            this.addInner(wrapper, mod, num);
            lastRowContainer.appendChild(wrapper);
        } else {
            let classes = DisplayUtils.createClasses(num, mod);
            let wrapper = DisplayUtils.createNode('div', classes);
            this.addInner(wrapper, mod, num);
            generalContainer.appendChild(wrapper);
        }
    }

    addInner(parent, mod, num) {
        parent.innerHTML = this.template;
        let text = firstByClass(parent, 'entry-text');
        if (this.entry.text && this.entry.text.length > 0) {
            this.entry.text.forEach(function (element) {
                let p = DisplayUtils.createNode('p', '', element);
                text.appendChild(p);
            })
        }
        let header = firstByClass(parent, 'box-header');
        let hNumber = DisplayUtils.createNode('h4', 'number', '<span>&#8470</span>' + ++this.entry.id);
        header.appendChild(hNumber);
        if (this.entry.title) {
            let hText = DisplayUtils.createNode('h4', 'title', this.entry.title);
            header.appendChild(hText);
        }

        if (this.entry.photo && this.entry.photo.length > 0) {
            if (DisplayUtils.isVertical(mod) || DisplayUtils.isLargeVertical(mod) && DisplayUtils.isViewportLarge()
                || (DisplayUtils.isNinthItem(mod) || DisplayUtils.isSmallVertical(mod)) && DisplayUtils.isViewportSmall()) {
                this.entry.photo = '<a href="https://placeholder.com"><img src="http://via.placeholder.com/216x216"></a>'
            }

            let div = firstByClass(parent, 'box-content');
            let photo = firstByClass(parent, 'entry-photo');
            div.classList.add("illustrated");
            const photoholder = document.createElement("div");
            photoholder.setAttribute("class", "entry-photo");
            photoholder.innerHTML = this.entry.photo;
            div.insertBefore(photoholder, div.firstChild);
            if (this.entry.photoWidth > this.entry.photoHeight) {
                text.classList.add('landscape');
                photoholder.classList.add('landscape');
            } else {
                text.classList.add('portrait');
                photoholder.classList.add('portrait');
            }
        }
    }
}


function addContent() {
    document.getElementById("myGallery").innerHTML = "";
    document.getElementById("gallery-last-row").innerHTML = "";
    let totalEntries = document.getElementById("number").value;
    let generalContainer = document.getElementById("myGallery");
    let lastRowContainer = document.getElementById("gallery-last-row");
    let entries = [
        {
            'id': 0,
            'photo': '<a href="https://placeholder.com"><img src="http://via.placeholder.com/153x230"></a>',
            'photoWidth': 153,
            'photoHeight': 230,
            'title': "Erat nemore propriae no",
            "text": ['Legimus noluisse dissentiet ea qui. Ex his placerat oporteat! Noluisse invidunt ei sed, nam eilaoreet iudicabit adipiscing, odio perfecto te mel!']
        },
        {
            'id': 1,
            'photo': '<a href="https://placeholder.com"><img src="http://via.placeholder.com/315x150"></a>',
            'photoWidth': 315,
            'photoHeight': 150,
            'title': "Erat nemore propriae no",
            "text": ['Legimus noluisse dissentiet ea qui. Ex his placerat oporteat! Noluisse invidunt ei sed, nam eilaoreet iudicabit adipiscing, odio perfecto te mel!']
        },
        {
            'id': 2,
            'photo': '',
            'title': "Erat nemore propriae no",
            "text": ['Has eu debitis delicata deterruisset. Nec veniam audiam ut. Utroque commune accumsan eihis, in mei mandamus recteque petentium! Mundi nemore an vel, persius veritus perfectovis te. Enim doming ius cu.',
                'Sea ponderum suavitate consequuntur ex, has latine aperiam neglegentur ne. Ei iriure principes consulatu est, tollit suscipit mea at, eu alii constituam eam! Eruditiefficiendi cu eam, alterum mentitum salutatus an per, eu sed facer labores. Vis dicamaperiam bonorum an, qui luptatum ocurreret id, nibh harum ancillae sea eu. Nec id proboomnesque, apeirian erroribus signiferumque sea te.']
        },
        {
            'id': 3,
            'photo': '<a href="https://placeholder.com"><img src="http://via.placeholder.com/315x150"></a>',
            'photoWidth': 315,
            'photoHeight': 150,
            'title': "Erat nemore propriae no",
            "text": ['Legimus noluisse dissentiet ea qui. Ex his placerat oporteat! Noluisse invidunt ei sed, nam eilaoreet iudicabit adipiscing, odio perfecto te mel!']
        },
        {
            'id': 4,
            'photo': '<a href="https://placeholder.com"><img src="http://via.placeholder.com/153x230"></a>',
            'photoWidth': 153,
            'photoHeight': 230,

            'title': "Erat nemore propriae no",
            "text": ['Legimus noluisse dissentiet ea qui. Ex his placerat oporteat! Noluisse invidunt ei sed, nam eilaoreet iudicabit adipiscing, odio perfecto te mel!']
        },
        {
            'id': 5,
            'photo': '<a href="https://placeholder.com"><img src="http://via.placeholder.com/153x230"></a>',
            'photoWidth': 153,
            'photoHeight': 230,
            'title': "Erat nemore propriae no",
            "text": ['Legimus noluisse dissentiet ea qui. Ex his placerat oporteat! Noluisse invidunt ei sed, nam eilaoreet iudicabit adipiscing, odio perfecto te mel!']
        }

    ];
    for (let i = 6; i <= totalEntries - 1; i++) {
        let entry = new ServerEntry(i);
        entries.push(entry.getJson());
    }

    for (let entry of entries) {
        let displayEntry = new DisplayEntry(entry, entries.length);
        displayEntry.display(generalContainer, lastRowContainer);

    }


}
