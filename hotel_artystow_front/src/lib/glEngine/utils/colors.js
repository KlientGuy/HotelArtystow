export class Colors {
    static normalizeRgb(r, g, b, a = 1) {
        return {
            r: r / 255,
            g: g / 255,
            b: b / 255,
            a
        }
    }
}
