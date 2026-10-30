
import toast from 'react-hot-toast';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  onSubmit: (value: string) => void;
}

export default function SearchBar({ onSubmit }: SearchBarProps) {
  const handleSubmit = (formData: FormData) => {
  const value = formData.get('query');

  if (typeof value === 'string') {
    const trimValue = value.trim();

    if (!trimValue) {
      toast.error('Please enter your search query.');
      return;
    }

    onSubmit(trimValue);
  }
};

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <a
          href="https://www.themoviedb.org/"
          className={styles.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by TMDb
        </a>

        <form action={handleSubmit} className={styles.form}>
          <input
            className={styles.input}
            type="text"
            name="query"
            autoComplete="off"
            placeholder="Search movies..."
            autoFocus
          />

          <button className={styles.button} type="submit">
            Search
          </button>
        </form>
      </div>
    </header>
  );
}
