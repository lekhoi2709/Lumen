import parse, {
  attributesToProps,
  DOMNode,
  domToReact,
  Element,
  HTMLReactParserOptions,
} from "html-react-parser";
import DOMPurify from "dompurify";

const options: HTMLReactParserOptions = {
  replace: (domNode) => {
    const typedDomNode = domNode as Element;

    if (!typedDomNode.attribs) return false;
    if (typedDomNode.attribs.class === "tiptap-paragraph") {
      return (
        <p
          {...attributesToProps(typedDomNode.attribs)}
          className="text-wrap break-words"
        >
          {typedDomNode.children &&
            domToReact(typedDomNode.children as DOMNode[], options)}
        </p>
      );
    }
  },
};

const htmlFromString = (text: string) => {
  const clean = DOMPurify.sanitize(text, { ADD_ATTR: ["target"] });
  return parse(clean, options);
};

export default htmlFromString;
