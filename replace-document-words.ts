import PizZip = require("pizzip");
import { DOMParser, XMLSerializer } from "@xmldom/xmldom";

export const replaceKeysDocumentTemplate = async (params: {
  file: Buffer;
  keys: string[];
  replacements: Record<string, string | string[]>;
}) => {
  const { file, keys, replacements } = params;
  const zip = new PizZip(file);
  const xmlStr = zip.files['word/document.xml'].asText();
  const doc = new DOMParser().parseFromString(xmlStr, 'text/xml');
  const textNodes = Array.from(doc.getElementsByTagName('w:t'));

  let fullText = '';
  const nodeGroups: Array<{
    nodes: any[];
    text: string;
  }> = [];
  let currentGroup: any[] = [];

  textNodes.forEach((node) => {
    fullText += node.textContent;
    currentGroup.push(node);
    if (/@[\w.]+@/.test(fullText)) {
      nodeGroups.push({ nodes: [...currentGroup], text: fullText });
      currentGroup = [];
      fullText = '';
    }
  });

  nodeGroups.forEach(({ nodes, text }) => {
    keys.forEach((key) => {
      const cleanKey = key.replace(/^@|@$/g, '');
      if (replacements[cleanKey] !== undefined) {
        let replacement = replacements[cleanKey];
        if (Array.isArray(replacement)) replacement = replacement.join(', ');
        text = text.replace(new RegExp(key, 'g'), replacement);
      }
    });

    let remainingText = text;
    nodes.forEach((node) => {
      node.textContent = remainingText.slice(0, node.textContent.length);
      remainingText = remainingText.slice(node.textContent.length);
    });

    if (remainingText.length > 0) {
      const lastNode = nodes[nodes.length - 1];
      const newTextNode = lastNode.cloneNode();
      newTextNode.textContent = remainingText;
      lastNode.parentNode.appendChild(newTextNode);
    }
  });

  zip.file('word/document.xml', new XMLSerializer().serializeToString(doc));
  return zip.generate({ type: 'nodebuffer' });
}



