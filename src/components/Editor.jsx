import React, { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
    Bars3BottomLeftIcon,
    Bars3BottomRightIcon,
    Bars3CenterLeftIcon,
    CircleStackIcon,
    LinkIcon,
    ListBulletIcon,
    PlusIcon,
    QueueListIcon,
    VideoCameraIcon
} from "@heroicons/react/24/outline/index.js";
import { PhotoIcon } from "@heroicons/react/16/solid/index.js";
import ReactSwitch from "react-switch";

const RichTextEditor = () => {
    const [content, setContent] = useState('');
    const [embedMenu, setEmbedMenu] = useState(false);
    const [embedMenuAboveButton, setEmbedMenuAboveButton] = useState(false);
    const modalRef = useRef(null);
    const editorContainerRef = useRef(null);
    const modalContainerRef = useRef(null);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState("image");
    const [videoSource, setVideoSource] = useState("");
    const [videoLink, setVideoLink] = useState("");
    const [disableCaption, setDisableCaption] = useState(false);
    const editorRef = useRef(null);
    const [droppedImage, setDroppedImage] = useState(null);

    useEffect(() => {
        if (!modalRef.current || !modalContainerRef.current)
            return;

        const modal = modalRef.current;
        const modalContainer = modalContainerRef.current;
        if (showModal) {
            modal.classList.remove("hidden");
            setTimeout(() => {
                modal.classList.remove("opacity-0");
                modalContainer.classList.remove("disappear");
            }, 500);
        } else {
            modal.classList.add("opacity-0");
            modalContainer.classList.add("disappear");
            setTimeout(() => {
                modal.classList.add("hidden");
            }, 500);
        }

    }, [showModal]);

    const handleChange = (value) => {
        setContent(value);
    };

    const attachItems = () => {
        toggleModal("image");
    };

    const formatText = (command, value = null) => {
        if (editorRef.current) {
            const editor = editorRef.current.getEditor();
            if (command === "removeFormat")
                editor.removeFormat(editor.getSelection());
            else if (command === "paragraph")
                editor.format('paragraph', editor.getSelection());
            else
                editor.format(command, value);
        }
    };

    const modules = {
        toolbar: false,
    };

    const toggleModal = (type) => {
        setModalType(type);
        setShowModal(!showModal);
    };

    const handleDropImage = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            setDroppedImage(e.target.result);
        };
        reader.readAsDataURL(file);
    };

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            setDroppedImage(e.target.result);
        };
        reader.readAsDataURL(file);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDragLeave = (event) => {
        event.preventDefault();
    };

    const handleEmbed = () => {
        if (modalType === "youtube" && videoLink.trim() !== "") {
            const embedCode = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoLink.slice(videoLink.indexOf("=") + 1)}" frameborder="0" allowfullscreen></iframe>`;
            const editor = editorRef.current.getEditor();
            const cursorPosition = editor.getSelection(true);
            setVideoLink("");
            editor.clipboard.dangerouslyPasteHTML(cursorPosition.index, embedCode);
        }
        if (modalType === "image" && droppedImage) {
            const embedCode = `<img src="${droppedImage}" alt="Embedded Image" />`;
            const editor = editorRef.current.getEditor();
            const cursorPosition = editor.getSelection(true);
            setDroppedImage(null);
            editor.clipboard.dangerouslyPasteHTML(cursorPosition.index, embedCode);
        }
        setEmbedMenu(false);
    };

    const toggleEmbedMenu = () => {
        setEmbedMenu(!embedMenu);

        if (editorContainerRef.current) {
            const editorHeightPercentage = (editorContainerRef.current.clientHeight / window.innerHeight) * 100;
            console.log(editorHeightPercentage)
            setEmbedMenuAboveButton(editorHeightPercentage > 50);
        }
    };

    return (
        <div className={"flex flex-col w-full max-w-2xl text-text"}>
            <div className={"py-11 border border-primary aspect-[4/5] outline-none w-full px-4"}>
                <input type="text" className={"text-2xl py-5 w-full outline-none font-bold"} placeholder={"Title"} />
                <div className="">
                    <div className="flex flex-row border rounded-sm w-fit items-center divide-x">
                        <div className="mr-2">
                            <select name="" id="" className={"px-2 font-light text-sm"} onChange={(e) => formatText('header', e.target.value)}>
                                <option value="4">Paragraph</option>
                                <option value="1">Heading 1</option>
                                <option value="2">Heading 2</option>
                                <option value="3">Heading 3</option>
                                <option value="4">Heading 4</option>
                                <option value="5">Heading 5</option>
                                <option value="6">Heading 6</option>
                            </select>
                        </div>
                        <div className="flex flex-row px-1">
                            <button onClick={() => toggleModal("link")} className={"px-3 py-3.5"}><LinkIcon className={"w-4 aspect-square"} /></button>
                            <button onClick={() => attachItems()} className={"px-3 py-3.5"}><PhotoIcon className={"w-4 aspect-square"} /></button>
                        </div>
                        <div className="flex flex-row px-1">
                            <button onClick={() => formatText('align', 'left')} className={"px-3 py-3.5"}><Bars3BottomLeftIcon className={"w-4 aspect-square"} /></button>
                            <button onClick={() => formatText('align', 'right')} className={"px-3 py-3.5"}><Bars3BottomRightIcon className={"w-4 aspect-square"} /></button>
                            <button onClick={() => formatText('align', 'center')} className={"px-3 py-3.5"}><Bars3CenterLeftIcon className={"w-4 aspect-square"} /></button>
                        </div>
                        <div className="flex flex-row px-1">
                            <button onClick={() => formatText('bold', true)} className={"px-3 py-3.5 text-xs text-center flex justify-center items-center font-bold"}>B</button>
                            <button onClick={() => formatText('italic', true)} className={"px-3 py-3.5 text-xs text-center flex justify-center items-center font-bold italic"}>I</button>
                        </div>
                        <div className="flex flex-row px-1">
                            <button onClick={() => formatText('list', 'bullet')} className={"px-3 py-3.5"}><ListBulletIcon className={"w-4 aspect-square"} /></button>
                            <button onClick={() => formatText('list', 'ordered')} className={"px-3 py-3.5"}><ListBulletIcon className={"w-4 aspect-square"} /></button>
                            <button onClick={() => formatText('removeFormat')} className={"px-3 py-3.5"}><QueueListIcon className={"w-4 aspect-square"} /></button>
                        </div>
                    </div>
                </div>
                <div className="w-full relative" ref={editorContainerRef}>
                    <ReactQuill
                        ref={editorRef}
                        value={content}
                        onChange={handleChange}
                        modules={modules}
                        style={{
                            outline: "none",
                            width: "100%",
                            height: "100%",
                            maxHeight: "calc(100vh - 390px)",
                            overflowY: "scroll",
                            scrollbarWidth: 0,
                            padding: "16px 0 40px",
                            border: "black 1px",
                            transitionProperty: "all",
                            transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
                            transitionDuration: "150ms"
                        }}
                    />
                    <div className="absolute bottom-0 left-0 z-10 w-full">
                        {embedMenu && (
                            <div className={"absolute bg-white transition-all rounded-lg shadow-xl min-w-96 py-2.5 " + (embedMenuAboveButton ? "-top-60" : "-bottom-60")}>
                                <h3 className={"font-light mb-3.5 px-2.5 text-xs"}>EMBEDS</h3>
                                <div className="">
                                    <button onClick={() => toggleModal("image")} className={"flex flex-row py-2 px-2.5 hover:text-gray-100 hover:bg-gray-400 transition-all w-full"}>
                                        <span className="mt-1 mr-2.5">
                                            <PhotoIcon className={"w-4 aspect-square"} />
                                        </span>
                                        <span className={"flex flex-col"}>
                                            <span className={"text-sm text-left font-medium mb-01"}>Picture</span>
                                            <span className={"ml-1 text-xs"}>Jpeg, PNG</span>
                                        </span>
                                    </button>
                                    <button onClick={() => toggleModal("youtube")} className={"flex flex-row py-2 px-2.5 hover:text-gray-100 hover:bg-gray-400 transition-all w-full"}>
                                        <span className="mt-1 mr-2.5">
                                            <VideoCameraIcon className={"w-4 aspect-square"} />
                                        </span>
                                        <span className={"flex flex-col"}>
                                            <span className={"text-sm text-left font-medium mb-01"}>Video</span>
                                            <span className={"ml-1 text-xs"}>Embed a Youtube Video</span>
                                        </span>
                                    </button>
                                    <button onClick={() => toggleModal("link")} className={"flex flex-row py-2 px-2.5 hover:text-gray-100 hover:bg-gray-400 transition-all w-full"}>
                                        <span className="mt-1 mr-2.5">
                                            <CircleStackIcon className={"w-4 aspect-square"} />
                                        </span>
                                        <span className={"flex flex-col"}>
                                            <span className={"text-sm text-left font-medium mb-01"}>Social Link</span>
                                            <span className={"ml-1 text-xs"}>Embed a Facebook Link</span>
                                        </span>
                                    </button>
                                </div>
                            </div>
                        )}
                        <button onClick={toggleEmbedMenu} className="p-2 flex items-center justify-center bg-[#E7F1E9] rounded-full">
                            <PlusIcon className={"w-6 aspect-square"} />
                        </button>
                    </div>
                </div>
            </div>
            <div className="text-right text-gray-600 text-[10px] px-4 py-2 border border-t-0 border-primary mb-4">
                {content.replace(/<\/?[\w\s="/.':;#-\/\?]+>/gi, "").length} words
            </div>

            <button className={"bg-[#0A7227] rounded-lg text-white ml-auto block w-fit py-2 px-4"}>Post</button>
            <div ref={modalRef} className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50 transition-all hidden opacity-0">
                <div ref={modalContainerRef} className="relative w-full max-w-2xl mx-auto my-6 bg-white rounded-lg shadow-lg transition-all disappear">
                    <div className="flex items-center justify-between px-4 py-4">
                        <h3 className={"font-bold"}>Embed</h3>
                        <button onClick={toggleModal} className="hover:text-gray-900">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                    {modalType === "image" ?
                        <div className="p-4 pt-0 h-full" onDrop={handleDropImage} onDragOver={handleDragOver} onDragLeave={handleDragLeave}>
                            {!droppedImage ?
                                <div>
                                    <h3 className={"mb-4 text-sm font-medium"}>Upload Image</h3>
                                    <div className="h-full mb-12 max-h-[140px] relative">
                                        <h2 className={"text-[10px]"}>FILE UPLOAD</h2>
                                        <input type="file" className={"absolute border opacity-0 w-full h-full"} onChange={handleFileSelect} />
                                        <div className="border border-dashed w-full h-full flex items-center justify-center">
                                            <div className="border border-[#CEE3D4] w-fit text-xs py-2 px-3 rounded-lg my-14">Import Image From Device</div>
                                        </div>
                                    </div>
                                </div>
                                :
                                <div>
                                    <img src={droppedImage} alt="Dropped Image" className="max-h-[250px] mb-4 mx-auto" />
                                </div>
                            }
                            <div className="flex space-x-3 font-medium">
                                <button className={"bg-[#0A7227] rounded-lg text-white block w-fit py-2 px-4"} onClick={handleEmbed}>Embed</button>
                                <button className={"rounded-lg border border-[#CEE3D4] block w-fit py-2 px-4"} onClick={toggleModal}>Cancel</button>
                            </div>
                        </div>
                        :
                        modalType === "youtube" ?
                            <div className="p-4 pt-0 h-full">
                                <div className="flex flex-col mb-4">
                                    <label className={"mb-2 uppercase text-[10px] font-light"}>Video Provider</label>
                                    <select value={videoSource} className={"text-xs bg-light outline-none border border-primary rounded-lg py-2.5 px-3"} onChange={(e) => setVideoSource(e.target.value)}>
                                        <option value="youtube">Youtube</option>
                                    </select>
                                </div>

                                <div className="flex flex-col mb-4">
                                    <label className={"mb-2 uppercase text-[10px] font-light"}>URL</label>
                                    <input value={videoLink} className={"text-xs bg-light outline-none border border-primary rounded-lg py-2.5 px-3"} onChange={(e) => setVideoLink(e.target.value)} />
                                </div>

                                <div className="flex space-x-3 font-medium">
                                    <button className={"bg-[#0A7227] rounded-lg text-white block w-fit py-2 px-4"} onClick={handleEmbed}>Embed</button>
                                    <button className={"rounded-lg border border-primary block w-fit py-2 px-4"} onClick={toggleModal}>Cancel</button>
                                </div>
                            </div>
                            :
                            modalType === "link" ?
                                <div className="p-4 pt-0 h-full">
                                    <div className="flex flex-col mb-4">
                                        <label className={"mb-2 uppercase text-[10px] font-light"}>Social Media Platform</label>
                                        <select value={videoSource} className={"text-xs bg-light outline-none border border-primary rounded-lg py-2.5 px-3"} onChange={(e) => setVideoSource(e.target.value)}>
                                            <option value="youtube">Facebook</option>
                                        </select>
                                    </div>

                                    <div className="flex flex-col mb-4">
                                        <label className={"mb-2 uppercase text-[10px] font-light"}>URL</label>
                                        <input className={"text-xs bg-light outline-none border border-primary rounded-lg py-2.5 px-3"} />
                                    </div>

                                    <div className="flex flex-col mb-4">
                                        <label className={"mb-2 uppercase text-[10px] font-light"}>Code</label>
                                        <input className={"text-xs bg-light outline-none border border-primary rounded-lg py-2.5 px-3"} />
                                    </div>

                                    <div className="flex flex-row items-center justify-between mb-4">
                                        <label className={"text-[10px] font-light"}>Disable Caption</label>
                                        <ReactSwitch height={14} width={24} handleDiameter={10} checked={disableCaption} checkedIcon={null} uncheckedIcon={null} onChange={setDisableCaption} />
                                    </div>

                                    <div className="flex space-x-3 font-medium">
                                        <button className={"bg-[#0A7227] rounded-lg text-white block w-fit py-2 px-4"} onClick={toggleModal}>Embed</button>
                                        <button className={"rounded-lg border border-primary block w-fit py-2 px-4"} onClick={toggleModal}>Cancel</button>
                                    </div>
                                </div>
                                : null
                    }
                </div>
            </div>
        </div>
    );
};

export default RichTextEditor;
