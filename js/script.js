const smallBreak = 800;
const largeBreak = 1200;
const landscapeIsDefault = 'landscape';
const smallScreenRowCount = 3;
const largeScreenRowCount = 5;
const itemsInPeriod = 15;
const lastRowWidthMediumScreen = '640px'; //counted from sass $horizontal-box-width + $box-vert-width + 2*$base-margin
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
}
const shuffleArray = arr => arr.sort(() => Math.random() - 0.5);
const generalContainer = document.getElementById("myGallery");
const lastRowContainer = document.getElementById("gallery-last-row");
let totalEntries

let allEntries;

let maxHeaderLength = 20;
let viewport;
window.onload = function () {
    viewport = window.innerWidth;

    let carousel = document.getElementsByClassName('carousel');
    console.log(carousel)
    if (carousel.length > 0) {
        for (let c of carousel) {
            let myCarousel = new Carousel(c.getAttribute('id'));
            myCarousel.activate()
        }
    }
};

$(window).resize(function () {
    viewport = window.innerWidth;
    DisplayUtils.clearGallery();
    if (allEntries && allEntries.length) {
        console.log('no server request needed');
        displayAllEntries()
    } else {
        addContent()
    }

});

function validate() {
    console.log(this);
    addContent()
    return false;
}

function firstByClass(parent, selector) {
    let div = parent.getElementsByClassName(selector);
    return div[0]
}

class SeverUtils {
    static getAllEntries(n, callback) {
        $.ajax({
            url: `http://localhost:1337/api/v1/notes?limit=${n}`
        }).then(function (data) {
            callback(data);

        });
    }
}

class DisplayUtils {
    static clearGallery() {
        document.getElementById("myGallery").innerHTML = "";
        document.getElementById("gallery-last-row").innerHTML = "";
    }

    static viewportExtraSmall() {
        return viewport < smallBreak
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
            dimensions = DisplayUtils.getPhotoSize(this.entry.orientation, DisplayUtils.needToAdjust(this.modulus, this.entryNumber));
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
    if(window.location.href.indexOf('gallery') === -1) {

        window.location.href = "gallery.html";
    }

    console.log('adding content');
    totalEntries = document.getElementById("number").value;
    DisplayUtils.clearGallery();
    console.log(totalEntries);
    SeverUtils.getAllEntries(totalEntries, function (data) {
        allEntries = data.data;
        // allEntries = shuffleArray(allEntries);

        for (let i = 0; i < allEntries.length; i++) {
            allEntries[i].counter = i;

            let displayEntry = new DisplayEntry(allEntries[i], allEntries.length);
            displayEntry.display(generalContainer, lastRowContainer);
        }
    });

}

function displayAllEntries() {
    for (let i = 0; i < allEntries.length; i++) {
        allEntries[i].counter = i;

        let displayEntry = new DisplayEntry(allEntries[i], allEntries.length);
        displayEntry.display(generalContainer, lastRowContainer);
    }
}

/************************************CAROUCEL****************************************************/
class Carousel {
    constructor(e) {
        this.element = document.getElementById(e);
        this.slides = this.element.getElementsByClassName('carousel-slide');
        this.bullets = this.element.getElementsByClassName('progress-bullet');
        this.links = this.allLinks();
        this.last = this.slides.length - 1;
        this.currentActiveNumber = 0;
    }

    allLinks() {
        let arr = [];
        for (let each of this.bullets) {
            arr.push(each.firstChild);
        }
        return arr
    }

    switchActive(currentNumber, targetNumber) {
        this.slides[currentNumber].classList.remove('active');
        this.slides[targetNumber].classList.add('active');
        this.bullets[currentNumber].classList.remove('active');
        this.bullets[targetNumber].classList.add('active');
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
            let target = link.dataset.slide - 1;
            link.addEventListener('click', this.showSlide.bind(this, target))
        }
    }

    showSlide(n) {
        console.log('link clicked');
        this.switchActive(this.currentActiveNumber, n);
        this.currentActiveNumber = n
    }

    nextSlide() {
        if (this.currentActiveNumber !== this.last) {
            this.switchActive(this.currentActiveNumber, this.currentActiveNumber + 1);
            this.currentActiveNumber++;
        }
    }

    prevSlide() {
        if (this.currentActiveNumber !== 0) {
            this.switchActive(this.currentActiveNumber, this.currentActiveNumber - 1);
            this.currentActiveNumber--;
        }
    }
}


