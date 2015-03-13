/*
 * Swiper plugin groupedPagination
 * version 1.0.0
 *
 * A plugin to Swiper 2 (http://www.idangero.us/sliders/swiper/) by Vladimir Kharlampidi
 *
 *
 * Render one pagination element per group instead of one element per slide
 *
 * by Erik E. Seierstad, Making Waves AS
 * http://www.makingwaves.no
 *
 *
 * Licencsed under GPL & MIT
 *
 * Release date: 2015-02-26
 *
 * Usage:
 * - include this script after swiper
 * - add "groupedPagination: true" to the Swiper constructor params object
 * - set slidesPerGroup param to whatever value you prefer
 */

Swiper.prototype.plugins.groupedPagination = function (instance) {
    var _this = instance;

    function $$(selector, context) {
        if (document.querySelectorAll) {
            return (context || document).querySelectorAll(selector);
        }
        return jQuery(selector, context);
    }

    function removePaginationEvents() {
        var pagers = _this.paginationButtons;
        if (pagers) {
            for (var i = 0; i < pagers.length; i++) {
                _this.h.removeEventListener(pagers[i], 'click', paginationClick);
            }
        }
    }

    function addPaginationEvents() {
        var pagers = _this.paginationButtons;
        if (pagers) {
            for (var i = 0; i < pagers.length; i++) {
                _this.h.addEventListener(pagers[i], 'click', paginationClick);
            }
        }
    }

    function paginationClick(e) {
        var target = e.target || e.srcElement,
            pagers = _this.paginationButtons,
            index,
            i;

        for (i = 0; i < pagers.length; i += 1) {
            if (target === pagers[i]) {
                if (_this.params.slidesPerGroup) {
                    index = i * _this.params.slidesPerGroup;
                } else {
                    index = i;
                }
            }
        }
        if (_this.params.autoplay) {
            _this.stopAutoplay(true);
        }
        _this.swipeTo(index);
    }



    return {
        beforeResizeFix: function () {
            _this.createPagination();
        },
        onFirstInit: function () {
            _this.createPagination = function (firstInit) {
                var paginationHTML,
                    numOfSlides,
                    numOfButtons,
                    i,
                    numOfSlidesPerButton;

                if (_this.params.paginationClickable && _this.paginationButtons) {
                    removePaginationEvents();
                }
                _this.paginationContainer = _this.params.pagination.nodeType ? _this.params.pagination : $$(_this.params.pagination)[0];
                if (_this.params.createPagination) {
                    paginationHTML = '';
                    numOfSlides = _this.slides.length;
                    if (_this.params.loop) {
                        numOfSlides -= _this.loopedSlides * 2;
                    }
                    numOfSlidesPerButton = _this.params.slidesPerGroup;
                    numOfButtons = Math.ceil(numOfSlides / numOfSlidesPerButton);

                    for (i = 0; i < numOfButtons; i += 1) {
                        paginationHTML += '<' + _this.params.paginationElement + ' class="' + _this.params.paginationElementClass + '"></' + _this.params.paginationElement + '>';
                    }
                    _this.paginationContainer.innerHTML = paginationHTML;
                }
                _this.paginationButtons = $$('.' + _this.params.paginationElementClass, _this.paginationContainer);
                if (!firstInit) {
                    _this.updatePagination();
                }
                _this.callPlugins('onCreatePagination');
                if (_this.params.paginationClickable) {
                    addPaginationEvents();
                }
            };

            _this.updatePagination = function (position) {
                var activePagers,
                    pagers,
                    i,
                    indexOffset,
                    visibleIndexes,
                    j,
                    visIndex,
                    getGroupIndex,
                    groupIndex;

                getGroupIndex = function (oldIndex) {
                    var g = _this.params.slidesPerGroup;
                    if (g && g > 1) {
                        return Math.floor(oldIndex / g) + (_this.slides.length - oldIndex > g ? 0 : 1);
                    }
                    return oldIndex;
                };

                if (!_this.params.pagination) {
                    return;
                }
                if (_this.slides.length < 1) {
                    return;
                }
                activePagers = $$('.' + _this.params.paginationActiveClass, _this.paginationContainer);
                if (!activePagers) {
                    return;
                }

                //Reset all Buttons' class to not active
                pagers = _this.paginationButtons;
                if (pagers.length === 0) {
                    return;
                }
                for (i = 0; i < pagers.length; i += 1) {
                    pagers[i].className = _this.params.paginationElementClass;
                }

                indexOffset = _this.params.loop ? _this.loopedSlides : 0;
                if (_this.params.paginationAsRange) {
                    if (!_this.visibleSlides) {
                        _this.calcVisibleSlides(position);
                    }
                    //Get Visible Indexes
                    visibleIndexes = [];

                    for (j = 0; j < _this.visibleSlides.length; j++) {
                        visIndex = _this.slides.indexOf(_this.visibleSlides[j]) - indexOffset;

                        if (_this.params.loop && visIndex < 0) {
                            visIndex = _this.slides.length - _this.loopedSlides * 2 + visIndex;
                        }
                        if (_this.params.loop && visIndex >= _this.slides.length - _this.loopedSlides * 2) {
                            visIndex = _this.slides.length - _this.loopedSlides * 2 - visIndex;
                            visIndex = Math.abs(visIndex);
                        }
                        visibleIndexes.push(visIndex);
                    }

                    for (j = 0; j < visibleIndexes.length; j++) {
                        if (pagers[visibleIndexes[j]]) {
                            pagers[visibleIndexes[j]].className += ' ' + _this.params.paginationVisibleClass;
                        }
                    }

                    if (_this.params.loop) {
                        groupIndex = getGroupIndex(_this.activeLoopIndex);
                        if (pagers[groupIndex] !== undefined) {
                            pagers[groupIndex].className += ' ' + _this.params.paginationActiveClass;
                        }
                    } else {
                        groupIndex = getGroupIndex(_this.activeIndex);
                        if (pagers[groupIndex]) {
                            pagers[groupIndex].className += ' ' + _this.params.paginationActiveClass;
                        }

                    }
                } else {
                    if (_this.params.loop) {
                        groupIndex = getGroupIndex(_this.activeLoopIndex);
                        if (pagers[groupIndex]) {
                            pagers[groupIndex].className += ' ' + _this.params.paginationActiveClass + ' ' + _this.params.paginationVisibleClass;
                        }
                    } else {
                        groupIndex = getGroupIndex(_this.activeIndex);

                        if (pagers[groupIndex]) {
                            pagers[groupIndex].className += ' ' + _this.params.paginationActiveClass + ' ' + _this.params.paginationVisibleClass;
                        }
                    }
                }
            };
        }
    };
};
