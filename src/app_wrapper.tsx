import * as React from "react";
import { Component } from "react";
import * as styles from "src/app_wrapper.css";
import { Container, Row, Col } from "react-grid-system";
import { Link } from "react-router-dom";

export class AppWrapper extends Component<any, undefined> {
    public static childContextTypes = {
        serverSideScreenClass: React.PropTypes.oneOf(["xs", "sm", "md", "lg", "xl"]),
        breakpoints: React.PropTypes.arrayOf(React.PropTypes.number),
        containerWidths: React.PropTypes.arrayOf(React.PropTypes.number),
        gutterWidth: React.PropTypes.number,
        dispatch: React.PropTypes.func,
    };

    constructor(props: {}) {
        super(props);
    }

    // required by react-grid-system or we wouldn't be
    // using it. please don't use getChildContext() to
    // pass things around, here or anywhere else!
    // **the one other exception is the dispatch function
    // the components in the tree need to use
    public getChildContext() {
        // 1. we basically don't want container widths
        // 2. we don't want gutter widths (for now we can
        // handle that ourselves)
        // 3. for now we won't worry about responsive
        // layouts, so we'll treat *any* device as xl
        return {
            containerWidths: [9999, 9999, 9999, 9999],
            gutterWidth: 0,
            breakpoints: [0, 0, 0, 1],
            dispatch: this.props.dispatch,
        };
    }

    public render() {
        return <Container>
            <Row>
                <Col xl={4}>
                    <div className={styles.menuBar}>(Logo here)</div>
                </Col>
                <Col xl={2}>
                    <Link to="/console"><div className={styles.menuBar}>Console</div></Link>
                </Col>
                <Col xl={2}>
                    <Link to="/admin">
                        <div className={styles.menuBar}>Admin</div>
                    </Link>
                </Col>
                <Col xl={4}>
                    <div className={styles.menuBarSpacer}/>
                </Col>
            </Row>
            {
                // the children may or may not be using react-grid-system
                this.props.children
            }
        </Container>;
    }
}
