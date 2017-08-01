const validSVG = `<svg class="pageviews_month" width="600" height="450"><g transform="translate(60, 50)"><g class="igj-axisX" fill="none" font-size="10" font-family="sans-serif" text-anchor="middle" transform="translate(0, 330)"><path class="domain" stroke="#000" d="M0.5,6V0.5H480.5V6" style="display: none;"></path></g><g class="igj-gridX" fill="none" font-size="10" font-family="sans-serif" text-anchor="middle" transform="translate(0, 330)"><path class="domain" stroke="#000" d="M0.5,-330V0.5H480.5V-330"></path></g><g class="igj-axisY" fill="none" font-size="10" font-family="sans-serif" text-anchor="end"><path class="domain" stroke="#000" d="M-6,330.5H0.5V0.5H-6" style="display: none;"></path></g><g class="igj-gridY" fill="none" font-size="10" font-family="sans-serif" text-anchor="end"><path class="domain" stroke="#000" d="M480,330.5H0.5V0.5H480"></path></g><text x="240" y="-27.77777777777778" class="igj-title" text-anchor="middle">Pageviews per month</text><g class="igj-legend" transform="translate(
            185.7179946899414,
            370
          )" style="cursor: pointer;"><g class="legendCells"><g class="cell" transform="translate(0,0)"><path class="swatch" d="M-7.0710678118654755,-7.0710678118654755h14.142135623730951v14.142135623730951h-14.142135623730951Z" style="fill: rgb(31, 119, 180);"></path><text class="label" transform="translate(0,
          25.071067810058594)" style="text-anchor: middle;">dataset0</text></g><g class="cell" transform="translate(54.14213562011719,0)"><path class="swatch" d="M-7.0710678118654755,-7.0710678118654755h14.142135623730951v14.142135623730951h-14.142135623730951Z" style="fill: rgb(255, 127, 14);"></path><text class="label" transform="translate(0,
          25.071067810058594)" style="text-anchor: middle;">dataset1</text></g></g></g><defs><clipPath id="clip"><rect transform="translate(-7.5, -7.5)" width="600" height="450"></rect></clipPath></defs><path class="igj-line line_0" stroke="#1f77b4" d="M0,105.03116729215722C27.403314917127073,52.5155836460786,54.80662983425414,0,82.20994475138122,0C106.96132596685082,0,131.71270718232043,69.51487813373622,156.46408839779005,74.06320463720905C183.8674033149171,79.09885183748256,211.2707182320442,81.6166754376193,238.67403314917127,81.6166754376193C265.1933701657459,81.6166754376193,291.71270718232046,52.28109910920415,318.23204419889504,52.28109910920415C345.63535911602213,52.28109910920415,373.03867403314916,52.95581104422994,400.44198895027625,54.30523491428153C426.96132596685084,55.61112898207338,453.4806629834254,141.46446342277306,480,227.31779786347278"></path><path class="igj-area area_0" fill="rgb(31, 119, 180)" d="M0,105.03116729215722C27.403314917127073,52.5155836460786,54.80662983425414,0,82.20994475138122,0C106.96132596685082,0,131.71270718232043,69.51487813373622,156.46408839779005,74.06320463720905C183.8674033149171,79.09885183748256,211.2707182320442,81.6166754376193,238.67403314917127,81.6166754376193C265.1933701657459,81.6166754376193,291.71270718232046,52.28109910920415,318.23204419889504,52.28109910920415C345.63535911602213,52.28109910920415,373.03867403314916,52.95581104422994,400.44198895027625,54.30523491428153C426.96132596685084,55.61112898207338,453.4806629834254,141.46446342277306,480,227.31779786347278L480,330C453.4806629834254,330,426.96132596685084,330,400.44198895027625,330C373.03867403314916,330,345.63535911602213,330,318.23204419889504,330C291.71270718232046,330,265.1933701657459,330,238.67403314917127,330C211.2707182320442,330,183.8674033149171,330,156.46408839779005,330C131.71270718232043,330,106.96132596685082,330,82.20994475138122,330C54.80662983425414,330,27.403314917127073,330,0,330Z"></path><g class="igj-focus focus_0" style="display: none;"><circle r="6" stroke="#1f77b4"></circle></g><circle class="igj-dot dot_0" cx="0" cy="105.03116729215722" r="5.5" fill="#1f77b4" opacity="1" style="cursor: pointer;"></circle><circle class="igj-dot dot_0" cx="82.20994475138122" cy="0" r="5.5" fill="#1f77b4" opacity="1" style="cursor: pointer;"></circle><circle class="igj-dot dot_0" cx="156.46408839779005" cy="74.06320463720905" r="5.5" fill="#1f77b4" opacity="1" style="cursor: pointer;"></circle><circle class="igj-dot dot_0" cx="238.67403314917127" cy="81.6166754376193" r="5.5" fill="#1f77b4" opacity="1" style="cursor: pointer;"></circle><circle class="igj-dot dot_0" cx="318.23204419889504" cy="52.28109910920415" r="5.5" fill="#1f77b4" opacity="1" style="cursor: pointer;"></circle><circle class="igj-dot dot_0" cx="400.44198895027625" cy="54.30523491428153" r="5.5" fill="#1f77b4" opacity="1" style="cursor: pointer;"></circle><circle class="igj-dot dot_0" cx="480" cy="227.31779786347278" r="5.5" fill="#1f77b4" opacity="1" style="cursor: pointer;"></circle><path class="igj-line line_1" stroke="#ff7f0e" d="M0,152.67153774646698C27.403314917127073,163.27367725070968,54.80662983425414,173.87581675495238,82.20994475138122,173.87581675495238C106.96132596685082,173.87581675495238,131.71270718232043,134.00842779713363,156.46408839779005,134.00842779713363C183.8674033149171,134.00842779713363,211.2707182320442,148.91070049821573,238.67403314917127,148.91070049821573C265.1933701657459,148.91070049821573,291.71270718232046,143.86174321723666,318.23204419889504,143.86174321723666C345.63535911602213,143.86174321723666,373.03867403314916,146.7086568022259,400.44198895027625,152.40248397220438C426.96132596685084,157.91263929799,453.4806629834254,201.20811689401955,480,244.50359449004912"></path><path class="igj-area area_1" fill="rgb(255, 127, 14)" d="M0,152.67153774646698C27.403314917127073,163.27367725070968,54.80662983425414,173.87581675495238,82.20994475138122,173.87581675495238C106.96132596685082,173.87581675495238,131.71270718232043,134.00842779713363,156.46408839779005,134.00842779713363C183.8674033149171,134.00842779713363,211.2707182320442,148.91070049821573,238.67403314917127,148.91070049821573C265.1933701657459,148.91070049821573,291.71270718232046,143.86174321723666,318.23204419889504,143.86174321723666C345.63535911602213,143.86174321723666,373.03867403314916,146.7086568022259,400.44198895027625,152.40248397220438C426.96132596685084,157.91263929799,453.4806629834254,201.20811689401955,480,244.50359449004912L480,330C453.4806629834254,330,426.96132596685084,330,400.44198895027625,330C373.03867403314916,330,345.63535911602213,330,318.23204419889504,330C291.71270718232046,330,265.1933701657459,330,238.67403314917127,330C211.2707182320442,330,183.8674033149171,330,156.46408839779005,330C131.71270718232043,330,106.96132596685082,330,82.20994475138122,330C54.80662983425414,330,27.403314917127073,330,0,330Z"></path><g class="igj-focus focus_1" style="display: none;"><circle r="6" stroke="#ff7f0e"></circle></g><circle class="igj-dot dot_1" cx="0" cy="152.67153774646698" r="5.5" fill="#ff7f0e" opacity="1" style="cursor: pointer;"></circle><circle class="igj-dot dot_1" cx="82.20994475138122" cy="173.87581675495238" r="5.5" fill="#ff7f0e" opacity="1" style="cursor: pointer;"></circle><circle class="igj-dot dot_1" cx="156.46408839779005" cy="134.00842779713363" r="5.5" fill="#ff7f0e" opacity="1" style="cursor: pointer;"></circle><circle class="igj-dot dot_1" cx="238.67403314917127" cy="148.91070049821573" r="5.5" fill="#ff7f0e" opacity="1" style="cursor: pointer;"></circle><circle class="igj-dot dot_1" cx="318.23204419889504" cy="143.86174321723666" r="5.5" fill="#ff7f0e" opacity="1" style="cursor: pointer;"></circle><circle class="igj-dot dot_1" cx="400.44198895027625" cy="152.40248397220438" r="5.5" fill="#ff7f0e" opacity="1" style="cursor: pointer;"></circle><circle class="igj-dot dot_1" cx="480" cy="244.50359449004912" r="5.5" fill="#ff7f0e" opacity="1" style="cursor: pointer;"></circle></g></svg>`;

export default validSVG;