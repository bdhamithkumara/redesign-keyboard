"use client"
import React, { useState, useEffect, useRef } from 'react'

const useSetState = (initialState = []) => {
    const [state, setState] = useState(new Set(initialState));
    const add = (item) => setState(state => new Set(state.add(item)));
    const remove = (item) => setState(state => {
        state.delete(item);
        return new Set(state);
    });
    return { set: state, add, remove, has: char => state.has(char) };
}

const useSound = (url) => {
    const sound = useRef(null);

    useEffect(() => {
        sound.current = new Audio(url);
        return () => {
            if (sound.current) {
                sound.current.pause();
                sound.current = null;
            }
        };
    }, [url]);

    return {
        play: () => sound.current && sound.current.play(),
        stop: () => {
            if (sound.current) {
                sound.current.pause();
                sound.current.currentTime = 0;
            }
        }
    }
};

const Key = ({ char, span, active }) => {
    return (
        <div className={['key', span && 'span', active && 'active'].filter(Boolean).join(' ')}>
            <div className='side' />
            <div className='top' />
            <div className='char'>{char}</div>
        </div>
    )
}

const Column = ({ children }) => (
    <div className='column'>
        {children}
    </div>
);

const Row = ({ children }) => (
    <div className='row'>
        {children}
    </div>
);

const Keyboard = () => {
    // Mechanical click sound 😎
    const { play, stop } = useSound('https://cdn.yoavik.com/codepen/mechanical-keyboard/keytype.mp3');

    const { add, remove, has } = useSetState([]);

    useEffect(() => {
        const handleKeyDown = (e) => { add(e.key); stop(); play(); };
        const handleKeyUp = (e) => remove(e.key);

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
        };
    }, [add, remove, play, stop]);

    const keys = (chars, spans = []) => chars.map((char, i) => (
        <Key key={char} char={char} span={spans[i] || false} active={has(char)} />
    ));

    return (
        <div className='keyboard'>
            <Column>
                <Row>
                    {keys(['`', '1', '2'])}
                </Row>
                <Row>
                    {keys(['TAB', 'q'], [true, false])}
                </Row>
                <Row>
                {keys(['CLK', 'a'], [true, false])}
                </Row>
                <Row>
                    {keys(['SFT', 'z'], [true, false])}
                </Row>
                <Row>
                {keys(['`', '1', '2'])}
                </Row>
            </Column>
            <Column>
                <Row>
                    {keys(['3', '4', '5'])}
                </Row>
                <Row>
                    {keys(['w', 'e', 'r'])}
                </Row>
                <Row>
                    {keys(['s', 'd', 'f'])}
                </Row>
                <Row>
                {keys(['x', 'c', 'v'])}
                </Row>
            </Column>
            <Column>
                <Row>
                    {keys(['6', '7', '8'])}
                </Row>
                <Row>
                    {keys(['t', 'y', 'u'])}
                </Row>
                <Row>
                    {keys(['g', 'h', 'j'])}
                </Row>
                <Row>
                {keys(['b', 'n', 'm'])}
                </Row>
            </Column>
            <Column>
                <Row>
                    {keys(['9', '0', '-'])}
                </Row>
                <Row>
                    {keys(['i', 'o', 'p'])}
                </Row>
                <Row>
                    {keys(['k', 'l', ';'])}
                </Row>
                <Row>
                {keys([',', '.', '/'])}
                </Row>
            </Column>

            <div className='shade' />
            <div className='cover' />
        </div>
    );
}

export default Keyboard;