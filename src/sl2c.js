import assert from 'power-assert'
import Complex from './complex';

export default class SL2C {
    constructor (a, b, c, d) {
        assert.ok(a instanceof Complex);
        assert.ok(b instanceof Complex);
        assert.ok(c instanceof Complex);
        assert.ok(d instanceof Complex);
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
    }

    mult (m) {
        assert.ok(m instanceof SL2C);
        return new SL2C(this.a.mult(m.a).add(this.b.mult(m.c)),
                        this.a.mult(m.b).add(this.b.mult(m.d)),
                        this.c.mult(m.a).add(this.d.mult(m.c)),
                        this.c.mult(m.b).add(this.d.mult(m.d)));
    }

    static prod (m1, m2) {
        assert.ok(m1 instanceof SL2C);
        return m1.mult(m2);
    }

    conjugate (m) {
        assert.ok(m instanceof SL2C);
        // m^-1 this m
        return SL2C.prod(SL2C.prod(m.inverse(), this), m);
    }

    apply (c) {
        assert.ok(c instanceof Complex);
        if (c.isInfinity()) {
            if (!this.c.isZero()) {
                return this.a.div(this.c);
            } else {
                return Complex.INFINITY;
            }
        }

        const nume = this.a.mult(c).add(this.b);
        const denom = this.c.mult(c).add(this.d);
        if (denom.isZero()) {
            return Complex.INFINITY;
        } else {
            return nume.div(denom);
        }
    }

    determinant () {
        return this.a.mult(this.d).sub(this.b.mult(this.c));
    }

    scale (k) {
        assert.ok(k instanceof Complex);
        return new SL2C(this.a.mult(k), this.b.mult(k),
                        this.c.mult(k), this.d.mult(k));
    }

    inverse () {
        return new SL2C(this.d, this.b.mult(Complex.MINUS_ONE),
                        this.c.mult(Complex.MINUS_ONE), this.a).scale(Complex.ONE.div(this.determinant()));
    }

    trace () {
        return this.a.add(this.d);
    }

    hasNaN () {
        return this.a.hasNaN() || this.b.hasNaN() || this.c.hasNaN() || this.d.hasNaN();
    }

    get linearArray () {
        return this.a.linearArray.concat(this.b.linearArray,
                                         this.c.linearArray,
                                         this.d.linearArray);
    }

    static get UNIT () {
        return new SL2C(Complex.ONE, Complex.ZERO,
                        Complex.ZERO, Complex.ONE);
    }
}
