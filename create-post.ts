import { promises as fs } from "fs";
import path from "path";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function createPost() {
  try {
    const templatePath = path.join(
      process.cwd(),
      ".cursor",
      "skills",
      "create-post",
      "assets",
      "template.mdx"
    );
    const template = await fs.readFile(templatePath, "utf8");

    rl.question("Enter the title for the new post: ", async (title: string) => {
      const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
      const filename = title.toLowerCase().replace(/\s+/g, "-");

      let newPostContent = template.replace("YYYY-MM-DD", today);
      newPostContent = newPostContent.replace("Your Post Title", title);

      const filePath = path.join(process.cwd(), "posts", `${filename}.mdx`);

      try {
        await fs.writeFile(filePath, newPostContent);
        console.log(`New post created at ${filePath}`);
      } catch (error) {
        console.error("Error writing file:", error);
      } finally {
        rl.close();
      }
    });
  } catch (error) {
    console.error("Error reading template:", error);
    rl.close();
  }
}

createPost();
