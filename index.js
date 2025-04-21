import React, { useState } from 'react';

export default function AlienMatch() {
  const [answers, setAnswers] = useState({});
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const questions = [
    {
      key: 'personality',
      question: 'What best describes your personality?',
      options: ['Adventurous', 'Mysterious', 'Playful', 'Serious']
    },
    {
      key: 'hobbies',
      question: 'What are your favorite hobbies or activities?',
      options: ['Stargazing', 'Teleportation Races', 'Quantum Poetry', 'Galactic Gardening']
    },
    {
      key: 'quirk',
      question: "What's something quirky about you?",
      options: ['Glows in the dark', 'Talks to plants', 'Obsessed with cheese moons', 'Licks meteorites']
    },
    {
      key: 'loveType',
      question: 'What do you look for in a partner?',
      options: ['Sense of adventure', 'Intelligence', 'Emotional depth', 'Alien charm']
    }
  ];

  const handleOptionChange = (key, value) => {
    setAnswers({ ...answers, [key]: value });
  };

  const generateAlienProfile = async () => {
    setLoading(true);
    setError(null);

    const prompt = `Create an alien dating profile based on these answers:\n\nPersonality: ${answers.personality}\nHobbies: ${answers.hobbies}\nQuirk: ${answers.quirk}\nLooking for: ${answers.loveType}`;

    try {
      const response = await fetch('/api/generateAlienProfile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.result) {
        throw new Error('Invalid API response: result is undefined');
      }

      const content = data.result;

      setMatch({
        content,
        image: 'https://source.unsplash.com/160x160/?alien,space'
      });
    } catch (err) {
      console.error('Failed to generate alien profile:', err);
      setError('Failed to generate alien profile. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white flex items-center justify-center p-6">
      <div className="bg-gray-800 max-w-xl w-full p-6 rounded-xl shadow-xl space-y-6">
        <div className="text-3xl font-bold text-center mb-4">🚀 AlienMatch</div>
        {!match && !loading && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              generateAlienProfile();
            }}
            className="space-y-6"
          >
            {questions.map((q) => (
              <div key={q.key} className="space-y-2">
                <p className="text-lg font-medium">{q.question}</p>
                <div className="grid grid-cols-2 gap-2">
                  {q.options.map((option) => (
                    <label key={option} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name={q.key}
                        value={option}
                        checked={answers[q.key] === option}
                        onChange={() => handleOptionChange(q.key, option)}
                        className="form-radio text-blue-500"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <button
              type="submit"
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full w-full"
            >
              Generate My Alien Profile
            </button>
          </form>
        )}
        {loading && <p className="text-center animate-pulse">🛸 Generating your alien identity...</p>}
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        {match && (
          <div className="text-center space-y-4">
            <img
              src={match.image}
              alt="alien"
              className="w-32 h-32 rounded-full mx-auto border-4 border-blue-400"
            />
            <p className="whitespace-pre-line text-sm text-gray-300">{match.content}</p>
          </div>
        )}
      </div>
    </div>
  );
}
