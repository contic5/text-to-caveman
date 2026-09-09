import './style.css'
import { syllable } from 'syllable';

//Try to get the word with the smallest number of syllables. Ideally we can get a word with one syllable. If not, we try to get the smallest word possible.
async function get_smallest_snyonym(word) 
{
  //https://api.datamuse.com/words/?rel_syn=ocean&md=s,f
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
      data[i]["frequency"]=parseFloat(frequency.substring(2,frequency.length));
    }
    //Sort data elements by number of syllables and by frequency descending
    data=data.sort((a,b)=>{
      if(a["numSyllables"]<b["numSyllables"])
      {
        return -1;
      }
      else if(a["numSyllables"]>b["numSyllables"])
      {
        return 1;
      }
      return b["frequency"]-a["frequency"]
    });
    
    console.log(`${word} ${complete_link}`);

    //return the word with the least number of syllables that is most popular among words with that many syllables.
    return data[0]["word"];
  } 
  catch (error) 
  {
    console.error("Error fetching data:", error);
    return "";
  }
}
function display_results(res_words)
{
  let res_element=document.getElementById("results");
  res_element.innerHTML="";
  for(let word of res_words)
  {
    let span=document.createElement("span");
    res_element.appendChild(span);
    span.innerHTML=word+" ";
    if(syllable(word)==1)
    {

    }
    else
    {
      span.style.color="red";
    }
  }
}
async function calculate_result_word(words,res_words=[],index=0)
{
  const word=words[index];

  //Skip searching for synonyms if the word only has one sound.
  if(syllable(word)==1)
  {
    res_words.push(word);
  }
  else
  {
    let synonym_word=await get_smallest_snyonym(word);
    //Try again if the word has an s at the end
    if(!synonym_word&&word.substring(word.length-1)=="s")
    {
      let shortened_word=word.slice(0,word.length-1);
      synonym_word=await get_smallest_snyonym(shortened_word);
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

  if(index<words.length-1)
  {
    setTimeout(()=>calculate_result_word(words,res_words,index+1),50);
  }
  else
  {
    display_results(res_words);
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

  if(!fast_test)
  {
    calculate_result_word(words,res_words,0);
  }
  else
  {
    res_words=[...words];
    display_results(res_words);
  }
}

let fast_test=false;
let start_text="This is a simple conversion test";
document.getElementById("original").value=start_text;