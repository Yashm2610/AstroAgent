import os
import re
import math
import logging
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

# Basic English stopwords
STOPWORDS = {
    'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', "you're", "you've", "you'll", "you'd",
    'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', "she's", 'her', 'hers',
    'herself', 'it', "it's", 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which',
    'who', 'whom', 'this', 'that', "that'll", 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been',
    'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if',
    'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between',
    'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out',
    'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why',
    'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not',
    'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', "don't", 'should',
    "should've", 'now', 'd', 'll', 'm', 'o', 're', 've', 'y', 'ain', 'aren', "aren't", 'couldn', "couldn't",
    'didn', "didn't", 'doesn', "doesn't", 'hadn', "hadn't", 'hasn', "hasn't", 'haven', "haven't", 'isn', "isn't",
    'ma', 'mightn', "mightn't", 'mustn', "mustn't", 'needn', "needn't", 'shan', "shan't", 'shouldn', "shouldn't",
    'wasn', "wasn't", 'weren', "weren't", 'won', "won't", 'wouldn', "wouldn't"
}

def tokenize(text: str) -> List[str]:
    """Tokenizes text into a list of lowercase alphanumeric words, filtering out stopwords."""
    words = re.findall(r'\b\w+\b', text.lower())
    return [w for w in words if w not in STOPWORDS]

class LocalRAGEngine:
    """
    A simple, zero-dependency RAG engine.
    Loads markdown files, splits them into sections based on headers,
    and performs keyword-based similarity retrieval.
    """
    def __init__(self, notes_dir: str):
        self.notes_dir = notes_dir
        self.sections: List[Dict[str, Any]] = []
        self.load_notes()

    def load_notes(self):
        """Loads all markdown files and parses them into hierarchical sections."""
        if not os.path.exists(self.notes_dir):
            logger.warning(f"RAG notes directory does not exist: {self.notes_dir}")
            return
            
        for filename in os.listdir(self.notes_dir):
            if filename.endswith(".md"):
                file_path = os.path.join(self.notes_dir, filename)
                try:
                    with open(file_path, "r", encoding="utf-8") as f:
                        content = f.read()
                        
                    # Split content by markdown headings (H1, H2, H3)
                    # We regex split while keeping the headings
                    tokens = re.split(r'(^#+\s+.*$)', content, flags=re.MULTILINE)
                    
                    current_header = filename[:-3].capitalize() # fallback header
                    current_level = 0
                    current_text = []
                    
                    for token in tokens:
                        token = token.strip()
                        if not token:
                            continue
                            
                        # Check if token is a heading line
                        heading_match = re.match(r'^(#+)\s+(.*)$', token)
                        if heading_match:
                            # Save the previous section first
                            if current_text:
                                text_content = "\n".join(current_text).strip()
                                if text_content:
                                    self.sections.append({
                                        "source": filename,
                                        "title": current_header,
                                        "content": f"{current_header}\n\n{text_content}",
                                        "tokens": tokenize(f"{current_header} {text_content}")
                                    })
                            
                            # Start new section
                            current_level = len(heading_match.group(1))
                            current_header = heading_match.group(2).strip()
                            current_text = []
                        else:
                            current_text.append(token)
                            
                    # Add last section
                    if current_text:
                        text_content = "\n".join(current_text).strip()
                        if text_content:
                            self.sections.append({
                                "source": filename,
                                "title": current_header,
                                "content": f"{current_header}\n\n{text_content}",
                                "tokens": tokenize(f"{current_header} {text_content}")
                            })
                            
                except Exception as e:
                    logger.error(f"Failed to read/parse {filename}: {str(e)}")
                    
        logger.info(f"Loaded {len(self.sections)} sections for RAG lookup.")

    def retrieve(self, query: str, top_k: int = 2) -> List[Dict[str, Any]]:
        """
        Retrieves the top_k most relevant sections matching the query.
        Uses a tf-idf inspired scoring system based on query word overlaps.
        """
        query_tokens = tokenize(query)
        if not query_tokens or not self.sections:
            return []
            
        scored_sections = []
        for sec in self.sections:
            score = 0.0
            sec_tokens_set = set(sec["tokens"])
            
            # Count word matches
            for q_tok in query_tokens:
                # Direct match in the content
                if q_tok in sec_tokens_set:
                    # Term frequency in section
                    tf = sec["tokens"].count(q_tok)
                    # Boost score if word is in the title
                    title_boost = 5.0 if q_tok in sec["title"].lower() else 1.0
                    
                    # Accumulate score
                    score += tf * title_boost
                    
            if score > 0:
                # Normalize by section length to avoid favoring super long articles too much
                # but give some weight to length. We divide by log of word count.
                len_norm = math.log(len(sec["tokens"]) + 2)
                normalized_score = score / len_norm
                scored_sections.append((normalized_score, sec))
                
        # Sort by score descending
        scored_sections.sort(key=lambda x: x[0], reverse=True)
        
        # Return top K sections
        results = []
        for score, sec in scored_sections[:top_k]:
            results.append({
                "title": sec["title"],
                "content": sec["content"],
                "source": sec["source"],
                "score": round(score, 3)
            })
            
        return results

# Helper instantiation function
def knowledge_lookup(query: str, top_k: int = 2) -> dict:
    """
    Exposes the RAG retrieval function as an agent tool.
    """
    try:
        # Determine the base directory of the app
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        notes_dir = os.path.join(base_dir, "data", "astrology_notes")
        
        engine = LocalRAGEngine(notes_dir)
        matches = engine.retrieve(query, top_k=top_k)
        
        return {
            "success": True,
            "query": query,
            "results": matches,
            "error": None
        }
    except Exception as e:
        logger.error(f"RAG lookup error: {str(e)}", exc_info=True)
        return {
            "success": False,
            "results": [],
            "error": f"RAG search failed: {str(e)}"
        }
