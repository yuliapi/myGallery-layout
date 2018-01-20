const smallBreak = 800;
const largeBreak = 1200;
const smallScreenRowCount = 3;
const largeScreenRowCount = 5;
const itemsInPeriod = 15;
const lastRowWidthMediumScreen = '640px'; //counted from sass $horizontal-box-width + $box-vert-width + 2*$base-margin

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
        if (n < itemsInPeriod) {
            t = "gallery-item item" + n;
        }
        if (mod === 0) {
            t = "gallery-item item15"
        }
        else {
            t = "gallery-item item" + mod;
        }
        //to display always vertical (except viewport < 800px)
        if (this.isVertical(mod, n)) {
            t = t + " vertical"
        }
        //800 < viewport < 1200 display vertical
        if (this.isSmallVertical(mod)) {
            t = t + " vertical-normal push-left"
        }
        //this rule applies to 5th, 11th, and 12th element.
        //always horizontal
        // and 800 < viewport < 1200 pushed-right
        if (mod === 5 || mod === 11 || mod === 12) {
            t = t + " push-right"
        }
        //800 < viewport < 1200 display horizontal and push right
        //viewport >= 1200 display vertical
        if (this.isLargeVertical(mod)) {
            t = t + " normal-vertical  push-right"
        }

        //800 < viewport < 1200 display vertical
        if (this.isNinthItem(mod)) {
            t = t + " vertical-normal"
        }
        return t
    };

    //select every 3th and 15th
    static isVertical(mod, n) {
        return mod === 3 || n === itemsInPeriod || (n - itemsInPeriod) / itemsInPeriod % 1 === 0;
    }

    //select every 6th item
    static isLargeVertical(mod) {
        return mod === 6;
    }

    //select every 4th and 10th item
    static isSmallVertical(mod) {
        return (mod === 4 || mod === 10)
    }

    // select every 9th item
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
    constructor(n) {
        this.counter = n;
        this.text = 'Here will be the text for #' + (this.counter + 1);
    }

    getJson() {
        return {"counter": this.counter, "text": [this.text]};
    };
}
class DisplayEntry {
    constructor(entry, totalEntriesCount) {
        this.entry = entry;
        this.entryNumber = this.entry.counter + 1;
        this.totalEntriesCount = totalEntriesCount;
        this.modulus = this.entryNumber % itemsInPeriod; // is used to determine every 1, 2, 3 ... 15 gallery-item
        this.template = document.getElementById('galleryItemInner').innerHTML;
    }

    display(generalContainer, lastRowContainer) {
        let totalModulus = 0;
        let needExtraRow = false;
        if (DisplayUtils.isViewportSmall()) {
            totalModulus = (this.totalEntriesCount % itemsInPeriod) % smallScreenRowCount;
            if (totalModulus < smallScreenRowCount) {
                needExtraRow = true;
            }
        }
        if (DisplayUtils.isViewportLarge()) {
            totalModulus = (this.totalEntriesCount % itemsInPeriod) % largeScreenRowCount;
            if (totalModulus < largeScreenRowCount - 1) { /*on large screen with max 5 items in a row  only 4 filled is ok and don't require last row*/
                needExtraRow = true;
            }
        }
        let box = DisplayUtils.createNode('div', "box", this.entryNumber);
        if (needExtraRow && this.entry.counter >= this.totalEntriesCount - totalModulus) {
            if (generalContainer.clientWidth && DisplayUtils.isViewportLarge()) {
                lastRowContainer.style.width = generalContainer.clientWidth + "px";
            } else if (DisplayUtils.isViewportSmall()) {
                lastRowContainer.style.width = lastRowWidthMediumScreen;
            }
            let wrapper = DisplayUtils.createNode('div', "gallery-item");
            this.addInner(wrapper, this.modulus, this.entryNumber);
            lastRowContainer.appendChild(wrapper);
        } else {
            let classes = DisplayUtils.createClasses(this.entryNumber, this.modulus);
            let wrapper = DisplayUtils.createNode('div', classes);
            this.addInner(wrapper, this.modulus, this.entryNumber);
            generalContainer.appendChild(wrapper);
        }
    }

    addInner(parent) {
        parent.innerHTML = this.template;
        let text = firstByClass(parent, 'entry-text');
        if (this.entry.text && this.entry.text.length > 0) {
            this.entry.text.forEach(function (element) {
                let p = DisplayUtils.createNode('p', '', element);
                text.appendChild(p);
            })
        }
        let header = firstByClass(parent, 'box-header');
        let hNumber = DisplayUtils.createNode('h4', 'number', '<span>&#8470</span>' + this.entryNumber);
        header.appendChild(hNumber);
        if (this.entry.title) {
            let hText = DisplayUtils.createNode('h4', 'title', this.entry.title);
            header.appendChild(hText);
        }
        if (this.entry.photo && this.entry.photo.length > 0) {
            if (this.needToAdjust()) {
                this.adjust()
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
            } else if (this.entry.photoWidth < this.entry.photoHeight) {
                text.classList.add('portrait');
                photoholder.classList.add('portrait');
            }
        }
    }

    needToAdjust() {
        if (DisplayUtils.isVertical(this.modulus) || DisplayUtils.isLargeVertical(this.modulus) && DisplayUtils.isViewportLarge()
            || (DisplayUtils.isNinthItem(this.modulus) || DisplayUtils.isSmallVertical(this.modulus)) && DisplayUtils.isViewportSmall()) {
            return true
        } else {
            return false
        }
    }

    adjust() {
        this.entry.photo = '<a href="https://placeholder.com"><img src="http://via.placeholder.com/216x216"></a>'
        this.entry.photoWidth = this.entry.photoHeight = 216
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
            'counter': 0,
            'photo': '<a href="https://placeholder.com"><img src="http://via.placeholder.com/153x230"></a>',
            'photoWidth': 153,
            'photoHeight': 230,
            'title': "Erat nemore propriae no",
            "text": ['Legimus noluisse dissentiet ea qui. Ex his placerat oporteat! Noluisse invidunt ei sed, nam eilaoreet iudicabit adipiscing, odio perfecto te mel!']
        },
        {
            'counter': 1,
            'photo': '<a href="https://placeholder.com"><img src="http://via.placeholder.com/315x150"></a>',
            'photoWidth': 315,
            'photoHeight': 150,
            'title': "Erat nemore propriae no",
            "text": ['Legimus noluisse dissentiet ea qui. Ex his placerat oporteat! Noluisse invidunt ei sed, nam eilaoreet iudicabit adipiscing, odio perfecto te mel!']
        },
        {
            'counter': 2,
            'photo': '<a href="https://placeholder.com"><img src="http://via.placeholder.com/153x230"></a>',
            'photoWidth': 153,
            'photoHeight': 230,
            'title': "Erat nemore propriae no",
            "text": ['Legimus noluisse dissentiet ea qui. Ex his placerat oporteat! Noluisse invidunt ei sed, nam eilaoreet iudicabit adipiscing, odio perfecto te mel!']
        },
        {
            'counter': 3,
            'photo': '<a href="https://placeholder.com"><img src="http://via.placeholder.com/315x150"></a>',
            'photoWidth': 315,
            'photoHeight': 150,
            'title': "Erat nemore propriae no",
            "text": ['Legimus noluisse dissentiet ea qui. Ex his placerat oporteat! Noluisse invidunt ei sed, nam eilaoreet iudicabit adipiscing, odio perfecto te mel!']
        },
        {
            'counter': 4,
            'photo': '<a href="https://placeholder.com"><img src="http://via.placeholder.com/153x230"></a>',
            'photoWidth': 153,
            'photoHeight': 230,

            'title': "Erat nemore propriae no",
            "text": ['Legimus noluisse dissentiet ea qui. Ex his placerat oporteat! Noluisse invidunt ei sed, nam eilaoreet iudicabit adipiscing, odio perfecto te mel!']
        },

        {
            'counter': 5,
            'photo': '',
            'title': "Erat nemore propriae no",
            "text": ['Has eu debitis delicata deterruisset. Nec veniam audiam ut. Utroque commune accumsan eihis, in mei mandamus recteque petentium! Mundi nemore an vel, persius veritus perfectovis te. Enim doming ius cu.',
                'Sea ponderum suavitate consequuntur ex, has latine aperiam neglegentur ne. Ei iriure principes consulatu est, tollit suscipit mea at, eu alii constituam eam! Eruditiefficiendi cu eam, alterum mentitum salutatus an per, eu sed facer labores. Vis dicamaperiam bonorum an, qui luptatum ocurreret id, nibh harum ancillae sea eu. Nec id proboomnesque, apeirian erroribus signiferumque sea te.']
        },
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
/************************************CAROUCEL****************************************************/
function changeSlide(e) {
    this.element = e.id;
    this.parent = document.getElementById(this.element.dataset.parent);

    this.target = this.element.dataset.target;

    let isActive = function (slide) {
        return slide.classList.contains('active')
    };
    let switchActive = function (current, target) {
        current.classList.remove('active');
        target.classList.add('active');
    };
    let currentActiveNumber;
    let allSlides = this.parent.getElementsByClassName('carousel-slide');
    console.log(allSlides[0]);

    for (let i = 0; i < allSlides.length; i++) {
        let slide = allSlides[i];
        if (isActive(slide)) {
            currentActiveNumber = i;
            break;
        }
    }
    console.log(typeof currentActiveNumber);
    if (this.target && this.target === 'next') {
        switchActive(allSlides[currentActiveNumber], allSlides[++currentActiveNumber])
    } else if (this.target && this.target === 'previous') {
        switchActive(allSlides[currentActiveNumber], allSlides[--currentActiveNumber])
    }



}