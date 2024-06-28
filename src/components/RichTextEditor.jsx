import {useEffect, useRef, useState} from "react";
import {
    Bars3BottomLeftIcon,
    Bars3BottomRightIcon,
    Bars3CenterLeftIcon,
    LinkIcon,
    ListBulletIcon,
    PlusIcon
} from "@heroicons/react/24/outline/index.js";
import {CircleStackIcon, PhotoIcon, VideoCameraIcon} from "@heroicons/react/16/solid/index.js";
import {makeOrderedList, makeUnorderedList} from "./stylingFunctions.js";

const RichTextEditor = () => {
    const editorRef = useRef(null);
    const [content, setContent] = useState('');
    const [embedMenu, setEmbedMenu] = useState(false)

    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.innerHTML = content + (content.endsWith("<br><br><br>") ? "" : "<br><br><br>");
        }
    }, [content]);

    const handleInput = () => {
        setContent(editorRef.current.innerHTML);
    };

    const getSelectedHtml = () => {
        let html = "";
        if (window.getSelection) {
            const sel = window.getSelection();
            if (sel.rangeCount) {
                const container = document.createElement("div");
                for (let i = 0, len = sel.rangeCount; i < len; ++i) {
                    container.appendChild(sel.getRangeAt(i).cloneContents());
                }
                html = container.innerHTML;
            }
        } else if (document.selection && document.selection.createRange) {
            html = document.selection.createRange().htmlText;
        }
        return html;
    };

    const updateStyling = (styling) => {
        const initState = getSelectedHtml()
        let finalState;
        if (styling === "insertUnorderedList") {
            finalState = makeUnorderedList(initState)
        }

        if (styling === "insertOrderedList") {
            finalState = makeOrderedList(initState)
        }

        document.execCommand(styling, true, true);
        setContent(editorRef.current.innerHTML);
    };

    const attachItems = () => {
        // Add attachment logic here
    };

    return (
        <div className={"flex flex-col w-full max-w-2xl"}>
            <div className={"py-11 border border-gray-500 aspect-[4/5] outline-none w-full px-4"}>
                <input type="text" className={"text-2xl py-5 w-full outline-none font-bold"} placeholder={"Title"}/>
                <div className="">
                    <div className="flex flex-row border rounded-sm w-fit items-center divide-x">
                        <div className="mr-2">
                            <select name="" id="" className={"px-2 font-light text-sm"}
                                    onChange={(e) => updateStyling(e.target.value)}>
                                <option value="paragraph">Paragraph</option>
                                <option value="heading_1">Heading 1</option>
                                <option value="heading_2">Heading 2</option>
                                <option value="heading_3">Heading 3</option>
                                <option value="heading_4">Heading 4</option>
                                <option value="heading_5">Heading 5</option>
                                <option value="heading_6">Heading 6</option>
                            </select>
                        </div>
                        <div className="flex flex-row px-1">
                            <button onClick={() => updateStyling("createLink")} className={"px-3 py-3.5"}><LinkIcon
                                className={"w-4 aspect-square"}/></button>
                            <button onClick={() => attachItems()} className={"px-3 py-3.5"}><PhotoIcon
                                className={"w-4 aspect-square"}/></button>
                        </div>
                        <div className="flex flex-row px-1">
                            <button onClick={() => updateStyling("justifyLeft")} className={"px-3 py-3.5"}>
                                <Bars3BottomLeftIcon className={"w-4 aspect-square"}/></button>
                            <button onClick={() => updateStyling("justifyRight")} className={"px-3 py-3.5"}>
                                <Bars3BottomRightIcon className={"w-4 aspect-square"}/></button>
                            <button onClick={() => updateStyling("justifyCenter")} className={"px-3 py-3.5"}>
                                <Bars3CenterLeftIcon className={"w-4 aspect-square"}/></button>
                        </div>
                        <div className="flex flex-row px-1">
                            <button onClick={() => updateStyling("bold")}
                                    className={"px-3 py-3.5 text-xs text-center flex justify-center items-center font-bold"}>B
                            </button>
                            <button onClick={() => updateStyling("italic")}
                                    className={"px-3 py-3.5 text-xs text-center flex justify-center items-center font-bold italic"}>I
                            </button>
                        </div>
                        <div className="flex flex-row px-1">
                            <button onClick={() => updateStyling("insertUnorderedList")} className={"px-3 py-3.5"}>
                                <ListBulletIcon className={"w-4 aspect-square"}/></button>
                            <button onClick={() => updateStyling("insertOrderedList")} className={"px-3 py-3.5"}>
                                <ListBulletIcon className={"w-4 aspect-square"}/></button>
                            <button onClick={() => updateStyling("formatBlock")} className={"px-3 py-3.5"}><LinkIcon
                                className={"w-4 aspect-square"}/></button>
                        </div>
                    </div>
                </div>
                <div className="w-full relative">
                    <div
                        ref={editorRef}
                        contentEditable
                        style={{
                            outline: "none",
                            width: "100%",
                            height: "100%",
                            maxHeight: "calc(100vh - 390px)",
                            overflowY: "scroll",
                            padding: "16px 0 40px",
                            border: "black 1px",
                            transitionProperty: "all",
                            transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
                            transitionDuration: "150ms"
                        }}
                        onInput={handleInput}
                        dir={"ltr"}
                    />
                    <div className="absolute bottom-0 left-0 z-10 w-full">
                        {
                            embedMenu &&
                            <div className="absolute bg-white -bottom-60 rounded-lg shadow-xl min-w-96 py-2.5">
                                <h3 className={"font-light mb-3.5 px-2.5"}>EMBEDS</h3>

                                <div className="">
                                    <button
                                        className={"flex flex-row py-2 px-2.5 hover:text-gray-100 hover:bg-gray-400 transition-all w-full"}>
                                    <span className="mt-1 mr-2.5">
                                        <PhotoIcon className={"w-6 aspect-square"}/>
                                    </span>
                                        <span className={"flex flex-col"}>
                                        <span className={"text-left font-medium mb-1"}>Picture</span>
                                        <span className={"ml-1 text-xs"}>Jpeg, PNG</span>
                                    </span>
                                    </button>

                                    <button
                                        className={"flex flex-row py-2 px-2.5 hover:text-gray-100 hover:bg-gray-400 transition-all w-full"}>
                                    <span className="mt-1 mr-2.5">
                                        <VideoCameraIcon className={"w-6 aspect-square"}/>
                                    </span>
                                        <span className={"flex flex-col"}>
                                        <span className={"text-left font-medium mb-1"}>Video</span>
                                        <span className={"ml-1 text-xs"}>Embed a Youtube Video</span>
                                    </span>
                                    </button>

                                    <button
                                        className={"flex flex-row py-2 px-2.5 hover:text-gray-100 hover:bg-gray-400 transition-all w-full"}>
                                    <span className="mt-1 mr-2.5">
                                        <CircleStackIcon className={"w-6 aspect-square"}/>
                                    </span>
                                        <span className={"flex flex-col"}>
                                        <span className={"text-left font-medium mb-1"}>Social Link</span>
                                        <span className={"ml-1 text-xs"}>Embed a Facebook Link</span>
                                    </span>
                                    </button>
                                </div>
                            </div>
                        }
                        <button onClick={() => setEmbedMenu(!embedMenu)}
                                className="p-2 flex items-center justify-center bg-[#E7F1E9] rounded-full">
                            <PlusIcon className={"w-6 aspect-square"}/>
                        </button>
                    </div>
                </div>
            </div>
            <div className="text-right text-gray-600 text-xs px-4 py-2 border border-t-0 border-gray-500 mb-4">
                {content.replace(/<\/?[\w\s="/.':;#-\/\?]+>/gi, "").length} words
            </div>
            <button className={"bg-[#0A7227] rounded-lg text-white ml-auto block w-fit py-2 px-4"}>Post</button>
        </div>
    )
}

export default RichTextEditor;
