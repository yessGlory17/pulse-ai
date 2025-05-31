import { MentionsInput, Mention } from 'react-mentions';
import { ComposerPrimitive } from '@assistant-ui/react';

const users = [
  { id: '1', display: 'Ali' },
  { id: '2', display: 'Ayşe' },
  { id: '3', display: 'Mehmet' },
];

<ComposerPrimitive.Root>
  <MentionsInput
    value={value}
    onChange={(e) => setValue(e.target.value)}
    placeholder="Mesajınızı yazın..."
  >
    <Mention trigger="@" data={users} displayTransform={(id, display) => `@${display}`} />
  </MentionsInput>
  <ComposerPrimitive.Send />
</ComposerPrimitive.Root>
