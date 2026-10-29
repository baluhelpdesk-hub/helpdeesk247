try {
    (() => {
        const __$$app$$__ = __$$hmAppManager$$__.currentApp;
        const __$$module$$__ = __$$app$$__.current;
        const h = new DeviceRuntimeCore.WidgetFactory(new DeviceRuntimeCore.HmDomApi(__$$app$$__, __$$module$$__));
        const logger = DeviceRuntimeCore.HmLogger.getLogger('watchface');

        const digits = p => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => p + i + '.png');
        const week = ['w1.png', 'w2.png', 'w3.png', 'w4.png', 'w5.png', 'w6.png', 'w7.png'];
        const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(i => 'm' + i + '.png');

        // Widgets shared by the normal and always-on (AOD) screens, at the same spots so nothing jumps.
        function drawCommon(level, timeDigits, timeY, mascot) {
            hmUI.createWidget(hmUI.widget.IMG, { x: 163, y: 24, src: mascot, show_level: level });

            hmUI.createWidget(hmUI.widget.IMG_TIME, {
                hour_startX: 42, hour_startY: timeY, hour_array: timeDigits, hour_zero: 1, hour_space: 0, hour_align: hmUI.align.LEFT,
                minute_startX: 264, minute_startY: timeY, minute_array: timeDigits, minute_zero: 1, minute_space: 0, minute_follow: 0, minute_align: hmUI.align.LEFT,
                show_level: level,
            });
            hmUI.createWidget(hmUI.widget.IMG, { x: 190, y: 139, src: 'colon.png', show_level: level });

            // date: "fri  OCT/30"
            hmUI.createWidget(hmUI.widget.IMG_WEEK, { x: 146, y: 302, week_en: week, week_tc: week, week_sc: week, show_level: level });
            hmUI.createWidget(hmUI.widget.IMG_DATE, {
                month_startX: 196, month_startY: 299, month_en_array: months, month_sc_array: months, month_tc_array: months,
                month_align: hmUI.align.LEFT, month_is_character: true,
                show_level: level,
            });
            hmUI.createWidget(hmUI.widget.IMG, { x: 254, y: 299, src: 'eslash.png', show_level: level });
            hmUI.createWidget(hmUI.widget.IMG_DATE, {
                day_startX: 273, day_startY: 299, day_en_array: digits('e'), day_sc_array: digits('e'), day_tc_array: digits('e'),
                day_zero: 1, day_space: 0, day_align: hmUI.align.LEFT, day_is_character: false,
                show_level: level,
            });
        }

        // Invisible tap area that opens a built-in watch app.
        function tapOpens(x, y, w, hgt, url) {
            hmUI.createWidget(hmUI.widget.BUTTON, {
                x, y, w, h: hgt, text: '', normal_src: 'empty.png', press_src: 'empty.png',
                click_func: () => hmApp.startApp({ url, native: true }),
                show_level: hmUI.show_level.ONLY_NORMAL,
            });
        }

        __$$module$$__.module = DeviceRuntimeCore.WatchFace({
            init_view() {
                const NORMAL = hmUI.show_level.ONLY_NORMAL;

                // Normal screen: background holds icons, labels, date pill and terminal lines.
                hmUI.createWidget(hmUI.widget.IMG, { x: 0, y: 0, w: 454, h: 454, src: 'bg.png', show_level: NORMAL });
                drawCommon(NORMAL, digits('t'), 130, 'mascot.png');

                hmUI.createWidget(hmUI.widget.TEXT_IMG, {
                    x: 62, y: 231, font_array: digits('n'), h_space: 0, align_h: hmUI.align.LEFT,
                    type: hmUI.data_type.HEART, show_level: NORMAL,
                });
                hmUI.createWidget(hmUI.widget.TEXT_IMG, {
                    x: 174, y: 231, font_array: digits('n'), h_space: 0, align_h: hmUI.align.LEFT,
                    type: hmUI.data_type.STEP, show_level: NORMAL,
                });
                hmUI.createWidget(hmUI.widget.TEXT_IMG, {
                    x: 336, y: 231, font_array: digits('n'), h_space: 0, align_h: hmUI.align.LEFT,
                    unit_en: 'pct.png', unit_sc: 'pct.png', unit_tc: 'pct.png',
                    type: hmUI.data_type.BATTERY, show_level: NORMAL,
                });
                hmUI.createWidget(hmUI.widget.IMG_LEVEL, {
                    x: 200, y: 370,
                    image_array: ['g0.png', 'g1.png', 'g2.png', 'g3.png', 'g4.png', 'g5.png', 'g6.png', 'g7.png', 'g8.png', 'g9.png', 'g10.png'],
                    image_length: 11,
                    type: hmUI.data_type.STEP, show_level: NORMAL,
                });

                // Taps: native app screen names as used by the original face (calendar, battery) and Zepp OS (activity).
                hmUI.createWidget(hmUI.widget.IMG_CLICK, { x: 26, y: 226, w: 114, h: 60, type: hmUI.data_type.HEART, show_level: NORMAL });
                tapOpens(140, 226, 156, 60, 'activityAppScreen');
                tapOpens(296, 226, 150, 60, 'Settings_batteryManagerScreen');
                tapOpens(106, 288, 240, 48, 'ScheduleCalScreen');

                // Always-on screen: black, only mascot + time + date (Zepp asks for ~10% lit pixels and no seconds).
                drawCommon(hmUI.show_level.ONLY_AOD, digits('a'), 135, 'mascot_aod.png'); // thinner digits + outline mascot, same spots
            },
            onInit() {
                logger.log('index page.js on init invoke');
            },
            build() {
                this.init_view();
                logger.log('index page.js on ready invoke');
            },
            onDestroy() {
                logger.log('index page.js on destroy invoke');
            }
        });
    })();
} catch (e) {
    console.log('Mini Program Error', e);
    e && e.stack && e.stack.split(/\n/).forEach(i => console.log('error stack', i));
}
