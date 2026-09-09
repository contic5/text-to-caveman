import './style.css'
import { syllable } from 'syllable';

async function get_one_syllable_synonyms(word) 
{
  //https://api.datamuse.com/words/?rel_syn=ocean&md=s
  const baseUrl = "https://api.datamuse.com/words";
  try 
  {
    //Get syllable and frequency count
    const complete_link=`${baseUrl}?rel_syn=${word}&md=s,f`;
    const response = await fetch(complete_link);
    let data = await response.json();

    //Add frequency count to each data element
    for(let i=0;i<data.length;i++)
    {
      let frequency=data[i]["tags"][0];
      data[i]["frequency"]=parseFloat(f.substring(2,frequency.length));
    }
    //Sort data elements by frequency descending
    data=data.sort((a,b)=>b["f"]-a["f"]);
    
    console.log(`${word} ${complete_link}`);

    //Get the first word that has 1 syllable.
    for(let i=0;i<data.length;i++)
    {
      if(data[i]["numSyllables"]==1)
      {
        return data[i]["word"];
      }
    }
    return "";
  } 
  catch (error) 
  {
    console.error("Error fetching data:", error);
    return "";
  }
}
export async function text_to_caveman()
{
  let original_element=document.getElementById("original");
  let original=original_element.value;
  original=original.trim();
  console.log(original);
  let words=original.split(" ");
  let res_words=[];

  for(let word of words)
  {
    //Skip searching for synonyms if the word only has one sound.
    if(syllable(word)==1)
    {
      res_words.push(word);
      continue;
    }

    let synonym_word=await get_one_syllable_synonyms(word);
    //Try again if the word has an s at the end
    if(!synonym_word&&word.substring(word.length-1)=="s")
    {
      let shortened_word=word.slice(0,word.length-1);
      synonym_word=await get_one_syllable_synonyms(shortened_word);
      if(synonym_word)
      {
        synonym_word+="s";
      }
    }

    //Add synonym word if the program found a new word 
    if(synonym_word)
    {
      res_words.push(synonym_word);
    }
    else
    {
      res_words.push(word);
    }
  }

  let res_element=document.getElementById("results");
  res_element.value=res_words.join(" ");
}