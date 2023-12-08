import OpenAI from 'openai'
import config from 'config'

const CHATGPT_MODEL = 'gpt-3.5-turbo'

const ROLES = {
  ASSISTANT: 'assistant',
  SYSTEM: 'system',
  USER: 'user',
}

const openai = new OpenAI({
  apiKey: config.get('OPENAI_KEY'),
})

const getMessage = (m) => `
нужно понятное объяснение с практическими примерами кода, которые можно использовать в реальных проектах: ${m}

Желательно, чтобы примеры были комментированы для лучшего понимания каждого шага. Текст не должен быть больше 300 слов. Главное, чтобы было корректно и легко читаемо, правильная последовательность + учтение контекста.
`

export async function chatGPT(message = '') {
  const messages = [
    {
      role: ROLES.SYSTEM,
      content:
        'Ты опытный программист с углубленным jScript с большим стажем, который доступным языком обьясняет код.',
    },
    { role: ROLES.USER, content: getMessage(message) },
  ]
  try {
    const completion = await openai.chat.completions.create({
      messages,
      model: CHATGPT_MODEL,
    })

    return completion.choices[0].message
  } catch (e) {
    console.error('Error while chat completion', e.message)
  }
}
