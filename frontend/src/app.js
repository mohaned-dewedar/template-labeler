const e = React.createElement;

function App() {
    const [step, setStep] = React.useState('upload');
    const [imgData, setImgData] = React.useState(null);
    const [index, setIndex] = React.useState(0);
    const [total, setTotal] = React.useState(0);
    const [inputType, setInputType] = React.useState('video');
    const [loading, setLoading] = React.useState(false);

    // Keyboard shortcut effect
    React.useEffect(() => {
        const handleKeyDown = (e) => {
            if (step !== 'review') return;
            if (e.key === 'a' || e.key === 'A') act('accept');
            if (e.key === 'p' || e.key === 'P') act('pass');
            if (e.key === 'd' || e.key === 'D') act('decline');
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [step]);

    const upload = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target);
        formData.append('inputType', inputType);

        try {
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const data = await res.json();
            setTotal(data.total);
            await fetchFrame();
        } catch (err) {
            console.error('Upload failed', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchFrame = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/frame');
            const data = await res.json();
            if (data.done) {
                setStep('complete');
            } else {
                setImgData(data.img_data);
                setIndex(data.index + 1);
                setTotal(data.total);
                setStep('review');
            }
        } catch (err) {
            console.error('Frame fetch failed', err);
        } finally {
            setLoading(false);
        }
    };

    const act = async (action) => {
        setLoading(true);
        try {
            await fetch('/api/action', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action })
            });
            await fetchFrame();
        } catch (err) {
            console.error('Action failed', err);
        } finally {
            setLoading(false);
        }
    };

    // Loading screen
    if (loading) {
        return e('div', { className: 'container' }, [
            e('h2', null, 'Processing...'),
            e('p', null, 'Please wait while frames are being processed.'),
            e('div', { className: 'spinner' })  // Add CSS spinner if you want
        ]);
    }

    if (step === 'upload') {
        return e('div', { className: 'container' }, [
            e('h1', null, 'Frame Review Tool'),
            e('form', { onSubmit: upload }, [
                e('div', { className: 'upload-section' }, [
                    e('div', { className: 'input-type-selector' }, [
                        e('div', {
                            className: `input-type-option ${inputType === 'video' ? 'active' : ''}`,
                            onClick: () => setInputType('video')
                        }, [
                            e('input', {
                                type: 'radio',
                                name: 'inputType',
                                value: 'video',
                                checked: inputType === 'video',
                                onChange: () => setInputType('video')
                            }),
                            e('label', { style: { margin: 0, cursor: 'pointer' } }, 'Video File')
                        ]),
                        e('div', {
                            className: `input-type-option ${inputType === 'zip' ? 'active' : ''}`,
                            onClick: () => setInputType('zip')
                        }, [
                            e('input', {
                                type: 'radio',
                                name: 'inputType',
                                value: 'zip',
                                checked: inputType === 'zip',
                                onChange: () => setInputType('zip')
                            }),
                            e('label', { style: { margin: 0, cursor: 'pointer' } }, 'ZIP Folder')
                        ])
                    ])
                ]),

                e('div', { className: 'form-group' }, [
                    e('label', null, inputType === 'video' ? 'Select Video File:' : 'Select ZIP File:'),
                    e('input', {
                        type: 'file',
                        name: inputType === 'video' ? 'video' : 'zip',
                        accept: inputType === 'video' ? 'video/*' : '.zip,.rar,.7z',
                        required: true
                    }),
                    e('div', { className: 'help-text' },
                        inputType === 'video'
                            ? 'Upload a video file to extract frames from'
                            : 'Upload a ZIP file containing image files'
                    )
                ]),

                e('div', { className: 'form-group' }, [
                    e('label', null, 'Template Image:'),
                    e('input', {
                        type: 'file',
                        name: 'template',
                        accept: 'image/*',
                        required: true
                    }),
                    e('div', { className: 'help-text' },
                        'Upload a template image for comparison'
                    )
                ]),

                e('button', {
                    type: 'submit',
                    className: 'btn-primary'
                }, 'Start Review')
            ])
        ]);
    }

    if (step === 'review') {
        return e('div', { className: 'container' }, [
            e('div', { className: 'review-container' }, [
                e('div', { className: 'frame-counter' }, `Frame ${index} / ${total}`),
                e('img', {
                    src: 'data:image/jpeg;base64,' + imgData,
                    className: 'frame-image'
                }),
                e('div', { className: 'action-buttons' }, [
                    e('button', {
                        onClick: () => act('accept'),
                        className: 'btn-primary'
                    }, 'Accept (A)'),
                    e('button', {
                        onClick: () => act('pass'),
                        className: 'btn-secondary'
                    }, 'Pass (P)'),
                    e('button', {
                        onClick: () => act('decline'),
                        className: 'btn-danger'
                    }, 'Decline (D)')
                ]),
                e('div', { className: 'hint-text' }, 'Press A / P / D to Accept / Pass / Decline')
            ])
        ]);
    }

    return e('div', { className: 'container' }, [
        e('div', { className: 'complete-container' }, [
            e('div', { className: 'complete-message' }, 'Review Complete!'),
            e('p', null, 'Your review has been completed successfully.'),
            e('a', {
                href: '/api/download',
                className: 'download-link'
            }, 'Download Accepted Images ZIP')
        ])
    ]);
    
}

ReactDOM.createRoot(document.getElementById('root')).render(e(App));
