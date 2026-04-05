const PLAY_EVENT = "vocaluz:audio-play";

export function notifyAudioPlay(id: string): void {
  window.dispatchEvent(new CustomEvent(PLAY_EVENT, { detail: { id } }));
}

export function subscribeAudioPlay(myId: string, onOtherPlay: () => void): () => void {
  const handler = (e: Event) => {
    const detail = (e as CustomEvent<{ id: string }>).detail;
    if (detail.id !== myId) onOtherPlay();
  };
  window.addEventListener(PLAY_EVENT, handler);
  return () => window.removeEventListener(PLAY_EVENT, handler);
}
