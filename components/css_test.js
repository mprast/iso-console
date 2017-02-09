import React, { Component } from "react";
import styles from './css_test.css'

export default class CssTest extends Component {

    render() {
        return <h className={ styles.h }>this should be styled</h> ;
    }
}
