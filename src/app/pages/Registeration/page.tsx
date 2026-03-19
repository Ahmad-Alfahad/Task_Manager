export default function Registeration() {
  return (
    <div>
      <h1>Registeration</h1>
      <form action="submit">
        <input type="text" placeholder="Username" />
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}