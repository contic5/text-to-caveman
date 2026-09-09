import './style.css'
import { syllable } from 'syllable';

// The package does not provide TypeScript declarations.
import synonyms from "synonyms";

export function text_to_caveman()
{
  let original_element=document.getElementById("original");
  let original=original_element.innerHTML;
  let words=original.split(" ");
  let res_words=[];

  for(let word of words)
  {
    const new_synonyms=synonyms(word);
    console.log(new_synonyms);
    let found=false;
    for(let synonym_word of new_synonyms["n"])
    {
      if(syllable(synonym_word)==1)
      {
        res_words.push(synonym_word);
        found=true;
        break;
      }
    }
    if(!found)
    {
      for(let synonym_word of new_synonyms["v"])
      {
        if(syllable(synonym_word)==1)
        {
          res_words.push(synonym_word);
          found=true;
          break;
        }
      }
    }
    if(!found)
    {
      res_words.push(word);
    }
  }

  let res_element=document.getElementById("results");
  res_element.innerHTML=res_words.join(" ");
}