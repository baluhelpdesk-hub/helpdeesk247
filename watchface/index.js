try {
    (() => {
        const __$$app$$__ = __$$hmAppManager$$__.currentApp;
        const __$$module$$__ = __$$app$$__.current;
        const h = new DeviceRuntimeCore.WidgetFactory(new DeviceRuntimeCore.HmDomApi(__$$app$$__, __$$module$$__));
        const logger = DeviceRuntimeCore.HmLogger.getLogger('watchface');

        const digits = p => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => p + i + '.png');
        const week = ['w1.png', 'w2.png', 'w3.png', 'w4.png', 'w5.png', 'w6.png', 'w7.png'];
        const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(i => 'm' + i + '.png');

        // New York wall clock from UTC: UTC-5, or UTC-4 in US daylight time (2nd Sunday of March to 1st Sunday of November).
        function nthSunday(year, month, n) {
            const firstWeekday = new Date(Date.UTC(year, month, 1)).getUTCDay();
            return 1 + ((7 - firstWeekday) % 7) + 7 * (n - 1);
        }
        function newYorkTime(nowMs) {
            const year = new Date(nowMs).getUTCFullYear();
            const dstStart = Date.UTC(year, 2, nthSunday(year, 2, 2), 7); // 2:00 EST
            const dstEnd = Date.UTC(year, 10, nthSunday(year, 10, 1), 6); // 2:00 EDT
            const offsetHours = nowMs >= dstStart && nowMs < dstEnd ? -4 : -5;
            const local = new Date(nowMs + offsetHours * 3600000);
            return { hour: local.getUTCHours(), minute: local.getUTCMinutes() };
        }

        // The native time widgets only show the device clock, so the New York digits are image widgets
        // whose sources are swapped by a timer whenever the minute changes.
        const nySlots = [];
        const nyAmPm = [];
        let nyShown = -1;
        let nyTimer = null;
        function drawNewYork(level, prefix, y, colonY, labelY) {
            [127, 167, 247, 287].forEach((x, pos) => {
                const widget = hmUI.createWidget(hmUI.widget.IMG, { x, y, src: prefix + '0.png', show_level: level });
                nySlots.push({ pos, prefix, widget });
            });
            hmUI.createWidget(hmUI.widget.IMG, { x: 207, y: colonY, src: 'tzcolon.png', show_level: level });
            hmUI.createWidget(hmUI.widget.IMG, { x: 99, y: labelY, src: 'tzlabel.png', show_level: level });
            nyAmPm.push(hmUI.createWidget(hmUI.widget.IMG, { x: 335, y: labelY, src: 'tzam.png', show_level: level }));
        }
        function updateNewYork() {
            const { hour, minute } = newYorkTime(new Date().getTime());
            const minuteOfDay = hour * 60 + minute;
            if (minuteOfDay === nyShown) return;
            nyShown = minuteOfDay;
            // 12-hour clock with a leading zero on the hour, like the main time.
            const hour12 = hour % 12 || 12;
            const d = [Math.floor(hour12 / 10), hour12 % 10, Math.floor(minute / 10), minute % 10];
            nySlots.forEach(s => s.widget.setProperty(hmUI.prop.SRC, s.prefix + d[s.pos] + '.png'));
            nyAmPm.forEach(w => w.setProperty(hmUI.prop.SRC, hour < 12 ? 'tzam.png' : 'tzpm.png'));
        }

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
                    x: 171, y: 402,
                    image_array: ['g0.png', 'g1.png', 'g2.png', 'g3.png', 'g4.png', 'g5.png', 'g6.png', 'g7.png', 'g8.png', 'g9.png', 'g10.png'],
                    image_length: 11,
                    type: hmUI.data_type.STEP, show_level: NORMAL,
                });

                // Secondary clock under the date: New York time in the main clock's font, at half size.
                drawNewYork(NORMAL, 'tz', 343, 347, 360);

                // Taps. Native screen names: the calendar name comes from the original face; the alarm, find phone
                // and world clock names are unverified and need a test on the watch.
                tapOpens(42, 130, 382, 88, 'AlarmScreen');                       // main time -> alarm
                tapOpens(163, 24, 128, 96, 'FindPhoneScreen');                   // mascot at the top -> find my phone
                tapOpens(106, 288, 240, 48, 'ScheduleCalScreen');                // date pill -> calendar
                tapOpens(99, 343, 258, 44, 'WorldClockScreen');                  // New York time -> world clock

                // Always-on screen: black, only mascot + time + date + New York time (Zepp asks for ~10% lit pixels and no seconds).
                drawCommon(hmUI.show_level.ONLY_AOD, digits('a'), 135, 'mascot.png'); // thinner digits + filled mascot, same spots
                drawNewYork(hmUI.show_level.ONLY_AOD, 'tza', 345, 346, 359);

                updateNewYork();
                nyTimer = timer.createTimer(1000, 5000, updateNewYork, {});
            },
            onInit() {
                logger.log('index page.js on init invoke');
            },
            build() {
                this.init_view();
                logger.log('index page.js on ready invoke');
            },
            onDestroy() {
                if (nyTimer) timer.stopTimer(nyTimer);
                logger.log('index page.js on destroy invoke');
            }
        });
    })();
} catch (e) {
    console.log('Mini Program Error', e);
    e && e.stack && e.stack.split(/\n/).forEach(i => console.log('error stack', i));
}
