const smallBreak = 800;
const largeBreak = 1200;
const landscapeIsDefault = 'landscape';
const smallScreenRowCount = 3;
const largeScreenRowCount = 5;
const itemsInPeriod = 15;
const lastRowWidthMediumScreen = '620px'; //counted from sass $horizontal-box-width + $box-vert-width + 2*$base-margin
const colorScheme = {
    '$green-grass': '#3ACC00',
    '$aqua-light': '#0ACCAB',
    '$agua-dark': '#00A3A3',
    '$lemon-yellow': '#F7E011',
    '$orange': '#E3900B',
    '$deep-rose': '#C8007D',
    '$sky-blue': '#00AAEB',
    '$classic-red': '#E60000',
    '$lavender': '#AB90BB',
    '$dusty-sand': '#F3D0BC',
    '$sunset': '#DAB3B8',
    '$cake-pink': '#FFC9E2'
};
const shuffleArray = arr => arr.sort(() => Math.random() - 0.5);
const generalContainer = document.getElementById("myGallery");
const lastRowContainer = document.getElementById("gallery-last-row");
let totalEntries;

let allEntries;
let extraRow;
let maxHeaderLength = 20;
let viewport;
window.onload = function () {
    viewport = window.innerWidth;
    let carousel = document.getElementsByClassName('carousel');
    if (carousel.length > 0) {
        for (let c of carousel) {
            let myCarousel = new Carousel(c.getAttribute('id'));
            myCarousel.activate()
        }
    }
};

function resize() {

    viewport = window.innerWidth;
    DisplayUtils.clearGallery();
    if (allEntries && allEntries.length) {
        displayAllEntries()
    } else {
        addContent()
    }
}

function validate() {
    console.log(this);
    addContent();
    return false;
}

function firstByClass(parent, selector) {
    let div = parent.getElementsByClassName(selector);
    return div[0]
}

class SeverUtils {
    static getAllEntries(n, callback) {
        $.ajax({
            url: `/api/v1/notes?limit=${n}`
        }).then(function (data) {
            callback(data);

        });
    }
}

class DisplayUtils {

    static clearGallery() {
        let gallery = document.getElementById("myGallery");
        if (gallery) {
            gallery.innerHTML = ""
        }
        let lastRow = document.getElementById("gallery-last-row");
        if (lastRow) {
            lastRow.innerHTML = ""
        }
    }

    static viewportExtraSmall() {
        return viewport < smallBreak
    }

    static getTotalModulus(count) {
        return (allEntries.length % itemsInPeriod) % count;
    }

    static needExtraRow () {
      let totalModulus;
        if (DisplayUtils.isViewportSmall()) {
            totalModulus =  this.getTotalModulus(smallScreenRowCount);
            if (totalModulus < smallScreenRowCount) {
                 return true;
            }
        } else if (DisplayUtils.isViewportLarge()) {
            totalModulus = this.getTotalModulus(largeScreenRowCount);
            if (totalModulus < largeScreenRowCount) {
                return true;
            }
        }else {
          return false
        }
    }
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
    }
    ;

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

    static getPhotoSize(orientation, adjust) {
        if (adjust && !DisplayUtils.viewportExtraSmall()) {
            return {width: 217, height: 217};
        }
        if (orientation && orientation === 'landscape') {
            return {width: 315, height: 150};
        } else {
            return ({width: 153, height: 230});
        }
    }

    static needToAdjust(modulus, number) {
        let vertical = DisplayUtils.isVertical(modulus, number);
        let largeVertical = DisplayUtils.isLargeVertical(modulus);
        let viewportLarge = DisplayUtils.isViewportLarge();
        let ninthItem = DisplayUtils.isNinthItem(modulus);
        let smallVertical = DisplayUtils.isSmallVertical(modulus);
        let viewportSmall = DisplayUtils.isViewportSmall();
        let largeVerticalOnLargeViewport = largeVertical && viewportLarge;
        let smallViewportCondition = (ninthItem || smallVertical) && viewportSmall;
        if (vertical || largeVerticalOnLargeViewport || smallViewportCondition) {
            return true
        }
        return false
    }
}

class DisplayEntry {
    constructor(entry) {
        this.entry = entry;
        this.entryNumber = this.entry.counter + 1;

        this.modulus = this.entryNumber % itemsInPeriod; // is used to determine every 1, 2, 3 ... 15 gallery-item
        this.template = document.getElementById('galleryItemInner').innerHTML;

    }

    display() {
        let totalModulus = 0;

        if (DisplayUtils.isViewportSmall()) {
            totalModulus = DisplayUtils.getTotalModulus(smallScreenRowCount);
        }
        if (DisplayUtils.isViewportLarge()) {
            totalModulus = DisplayUtils.getTotalModulus(largeScreenRowCount);
        }

        if (extraRow && this.entry.counter >= allEntries.length - totalModulus) {
            if (generalContainer.clientWidth && DisplayUtils.isViewportLarge()) {
                lastRowContainer.style.width = generalContainer.clientWidth + "px";
            } else if (DisplayUtils.isViewportSmall()) {
                lastRowContainer.style.width = lastRowWidthMediumScreen;
            }

            let wrapper = DisplayUtils.createNode('div', "gallery-item");
            this.addInner(wrapper, true);
            lastRowContainer.appendChild(wrapper);
        } else {
            let classes = DisplayUtils.createClasses(this.entryNumber, this.modulus);
            let wrapper = DisplayUtils.createNode('div', classes);
            this.addInner(wrapper, false);
            generalContainer.appendChild(wrapper);
        }
    }

    addInner(parent, lastRow) {
        parent.innerHTML = this.template;
        let dimensions;
        //*****************Adding card header content*************************//
        let header = firstByClass(parent, 'box-header');
        let hNumber = DisplayUtils.createNode('h4', 'number', '<span>&#8470</span>' + this.entryNumber);
        header.appendChild(hNumber);
        if (this.entry.title) {
            let hText = DisplayUtils.createNode('h4', 'title', this.entry.title);

            if (this.entry.title.length >= maxHeaderLength) {
                header.classList.add('small');
            }
            header.appendChild(hText);
        }
        //*****************Adding card photo*********************************//

        if (this.entry.photo && this.entry.photo.length > 0) {
            if (lastRow) {
                dimensions = DisplayUtils.getPhotoSize(this.entry.orientation, false)
            } else {
                dimensions = DisplayUtils.getPhotoSize(this.entry.orientation, DisplayUtils.needToAdjust(this.modulus, this.entryNumber));
            }

            let div = firstByClass(parent, 'box-content');
            div.classList.add("illustrated");
            const photoholder = document.createElement("div");
            photoholder.setAttribute("class", "entry-photo");
            if (!DisplayUtils.isVertical(this.modulus, this.entryNumber)) {
                photoholder.classList.add(this.entry.orientation);
            } else {
                photoholder.classList.add(`${this.entry.orientation}-adjusted`);
            }
            const placeholder = document.createElement("div");
            placeholder.setAttribute("style", `width: ${dimensions.width}px;height: ${dimensions.height}px;background: ${colorScheme[this.entry.photo]}`);
            photoholder.appendChild(placeholder);
            div.insertBefore(photoholder, div.firstChild);
        }
        //*****************Adding card text content*************************//
        let text = firstByClass(parent, 'entry-text');
        if (DisplayUtils.viewportExtraSmall()) {
            text.classList.add(landscapeIsDefault)
        }
        if (this.entry.orientation && dimensions.width !== dimensions.height) {
            text.classList.add(this.entry.orientation)
        }
        if (this.entry.body && this.entry.body.length > 0) {
            let p = DisplayUtils.createNode('p', '', this.entry.body);
            p.innerHTML = this.entry.body;
            text.appendChild(p);
        }
    }
}

function addContent() {
    if (document.getElementById("number") && totalEntries !== 0) {
        totalEntries = document.getElementById("number").value;
    }

    DisplayUtils.clearGallery();

    console.log('adding content, totalEntries');
    if (totalEntries > 0) {
        SeverUtils.getAllEntries(totalEntries, function (data) {
            allEntries = data.data;
            // allEntries = shuffleArray(allEntries);
            extraRow = DisplayUtils.needExtraRow();
            for (let i = 0; i < allEntries.length; i++) {
                allEntries[i].counter = i;
                let displayEntry = new DisplayEntry(allEntries[i], allEntries.length);
                displayEntry.display();
            }
        });
    }
}

function displayAllEntries() {
    extraRow = DisplayUtils.needExtraRow();
    for (let i = 0; i < allEntries.length; i++) {
        allEntries[i].counter = i;
        let displayEntry = new DisplayEntry(allEntries[i]);
        displayEntry.display();    }
}


/************************************CAROUSEL**************************************************/
class Slide {
    constructor(slide) {
        this.slide = slide;
    }

    checkAndRemoveClass(name) {
        if (this.slide.classList.contains(name)) {
            this.slide.classList.remove(name)
        }
    }

    addNewClass(name) {
        if (this.slide && this.slide.classList.contains(name) === false) {
            this.slide.classList.add(name)
        }
    }
}

class Carousel {
    constructor(e) {
        this.element = document.getElementById(e);
        this.slides = this.element.getElementsByClassName('carousel-slide');
        this.modifiedSlides = [];
        for (let s of this.slides) {
            this.modifiedSlides.push(new Slide(s))
        }
        this.controls = this.element.getElementsByClassName('slide-control');

        this.bullets = this.element.getElementsByClassName('progress-bullet');
        this.links = this.allLinks();
        this.currentActiveNumber = 0;
    }

    allLinks() {
        let arr = [];
        for (let each of this.bullets) {
            arr.push(each.firstChild);
        }
        return arr
    }

    activate() {
        let allNext = this.element.getElementsByClassName('control-next');
        let allPrev = this.element.getElementsByClassName('control-prev');
        for (let next of allNext) {
            next.addEventListener('click', this.nextSlide.bind(this));
        }
        for (let prev of allPrev) {
            prev.addEventListener('click', this.prevSlide.bind(this));
        }
        for (let link of this.links) {
            let target = link.dataset.slide;
            link.addEventListener('click', this.showSlide.bind(this, target))
        }
    }

    nextSlide() {
        if (this.currentActiveNumber === 0) {
            this.switchDisabled('previous', false);
        }
        if (this.currentActiveNumber !== this.modifiedSlides.length - 1) {
            this.switchActive(this.currentActiveNumber + 1);

            this.currentActiveNumber++;

            if (this.currentActiveNumber === this.modifiedSlides.length - 1) {
                this.switchDisabled('next', true);
            }
        }
    }

    prevSlide() {
        if ((this.currentActiveNumber + 1) === this.modifiedSlides.length) {
            this.switchDisabled('next', false);
        }
        if (this.currentActiveNumber !== 0) {
            this.switchActive(this.currentActiveNumber - 1);
            this.currentActiveNumber--;
        }
        if (this.currentActiveNumber === 0) {
            this.switchDisabled('previous', true);

        }
    }

    showSlide(n) {
        console.log('link clicked');
        console.log("active:" + this.currentActiveNumber + " ,switch to: " + n);
        n = parseInt(n);
        this.switchActive(n);
        this.currentActiveNumber = n;
    }


    switchActive(targetNumber) {
        this.modifiedSlides[targetNumber].checkAndRemoveClass('slide-right');
        this.modifiedSlides[targetNumber].checkAndRemoveClass('slide-left');
        this.modifiedSlides[targetNumber].checkAndRemoveClass('next');
        this.modifiedSlides[targetNumber].checkAndRemoveClass('previous');

        this.modifiedSlides[targetNumber].addNewClass('active');

        for (let s = 0; s < targetNumber; s++) {
            this.modifiedSlides[s].addNewClass('slide-left');
            this.modifiedSlides[s].checkAndRemoveClass('slide-right');
            this.modifiedSlides[s].checkAndRemoveClass('active');
            this.modifiedSlides[s].checkAndRemoveClass('previous');
            this.modifiedSlides[s].checkAndRemoveClass('next');
        }
        for (let k = targetNumber + 1; k < this.modifiedSlides.length; k++) {
            this.modifiedSlides[k].addNewClass('slide-right');
            this.modifiedSlides[k].checkAndRemoveClass('slide-left');
            this.modifiedSlides[k].checkAndRemoveClass('active');
            this.modifiedSlides[k].checkAndRemoveClass('previous');
            this.modifiedSlides[k].checkAndRemoveClass('next');
        }
        if (this.modifiedSlides[targetNumber - 1]) {
            this.modifiedSlides[targetNumber - 1].addNewClass('previous');
        }

        if (this.modifiedSlides[targetNumber + 1]) {
            this.modifiedSlides[targetNumber + 1].addNewClass('next');
        }

        for (let b of this.bullets) {
            if (b.classList.contains('active')) {
                b.classList.remove('active');
            }
        }
        this.bullets[targetNumber].classList.add('active');
    }

    switchDisabled(target, value) {
        for (let c of this.controls) {
            if (c.dataset.target === target) {
                c.disabled = value
            }
        }
    }

}


