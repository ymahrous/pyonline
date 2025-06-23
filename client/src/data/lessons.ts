export interface Lesson {
  id: number;
  title: string;
  description: string;
  icon: string;
  content: string;
  example: string;
}

export const lessons: Lesson[] = [
  {
    id: 1,
    title: "Introduction to Python",
    description: "Learn the basics of Python programming and why it's so popular.",
    icon: "fas fa-play-circle",
    content: `
      <h2>Welcome to Python!</h2>
      <p>Python is a high-level, interpreted programming language known for its simplicity and readability. 
      It was created by Guido van Rossum and first released in 1991.</p>
      
      <h3>Why Python?</h3>
      <ul>
        <li>Easy to learn and understand</li>
        <li>Versatile - used in web development, data science, AI, and more</li>
        <li>Large community and extensive libraries</li>
        <li>Cross-platform compatibility</li>
      </ul>
      
      <h3>Your First Python Program</h3>
      <p>Let's start with the traditional "Hello, World!" program:</p>
      <pre><code>print("Hello, World!")</code></pre>
    `,
    example: 'print("Hello, World!")\nprint("Welcome to Python!")'
  },
  {
    id: 2,
    title: "Variables and Data Types",
    description: "Understand how to store and work with different types of data in Python.",
    icon: "fas fa-database",
    content: `
      <h2>Variables and Data Types</h2>
      <p>Variables are containers for storing data values. Python has several built-in data types.</p>
      
      <h3>Basic Data Types:</h3>
      <ul>
        <li><strong>Strings:</strong> Text data enclosed in quotes</li>
        <li><strong>Integers:</strong> Whole numbers</li>
        <li><strong>Floats:</strong> Decimal numbers</li>
        <li><strong>Booleans:</strong> True or False values</li>
      </ul>
      
      <h3>Creating Variables:</h3>
      <pre><code>name = "Alice"
age = 25
height = 5.6
is_student = True</code></pre>
    `,
    example: 'name = "Your Name"\nage = 25\nprint(f"Hello, {name}! You are {age} years old.")'
  },
  {
    id: 3,
    title: "Control Flow",
    description: "Master if statements, loops, and conditional logic.",
    icon: "fas fa-code-branch",
    content: `
      <h2>Control Flow</h2>
      <p>Control flow statements allow you to control the execution of your program based on conditions.</p>
      
      <h3>If Statements:</h3>
      <pre><code>if age >= 18:
    print("You are an adult")
elif age >= 13:
    print("You are a teenager")
else:
    print("You are a child")</code></pre>
      
      <h3>Loops:</h3>
      <p><strong>For Loop:</strong></p>
      <pre><code>for i in range(5):
    print(f"Count: {i}")</code></pre>
      
      <p><strong>While Loop:</strong></p>
      <pre><code>count = 0
while count < 5:
    print(count)
    count += 1</code></pre>
    `,
    example: 'for i in range(1, 6):\n    if i % 2 == 0:\n        print(f"{i} is even")\n    else:\n        print(f"{i} is odd")'
  },
  {
    id: 4,
    title: "Functions and Methods",
    description: "Learn to create reusable code with functions and methods.",
    icon: "fas fa-cogs",
    content: `
      <h2>Functions and Methods</h2>
      <p>Functions are reusable blocks of code that perform specific tasks.</p>
      
      <h3>Defining Functions:</h3>
      <pre><code>def greet(name):
    return f"Hello, {name}!"

def add_numbers(a, b):
    return a + b</code></pre>
      
      <h3>Calling Functions:</h3>
      <pre><code>message = greet("Alice")
result = add_numbers(5, 3)
print(message)  # Hello, Alice!
print(result)   # 8</code></pre>
      
      <h3>Parameters and Arguments:</h3>
      <ul>
        <li><strong>Parameters:</strong> Variables in function definition</li>
        <li><strong>Arguments:</strong> Values passed to function when called</li>
      </ul>
    `,
    example: 'def calculate_area(length, width):\n    area = length * width\n    return area\n\nresult = calculate_area(5, 3)\nprint(f"Area: {result}")'
  },
  {
    id: 5,
    title: "Lists, Tuples, and Dictionaries",
    description: "Work with Python's most important data structures.",
    icon: "fas fa-list",
    content: `
      <h2>Data Structures</h2>
      <p>Python provides several built-in data structures to organize and store data.</p>
      
      <h3>Lists:</h3>
      <p>Ordered, mutable collections of items.</p>
      <pre><code>fruits = ["apple", "banana", "orange"]
fruits.append("grape")
print(fruits[0])  # apple</code></pre>
      
      <h3>Tuples:</h3>
      <p>Ordered, immutable collections of items.</p>
      <pre><code>coordinates = (10, 20)
x, y = coordinates  # Unpacking</code></pre>
      
      <h3>Dictionaries:</h3>
      <p>Key-value pairs for storing related data.</p>
      <pre><code>person = {
    "name": "Alice",
    "age": 30,
    "city": "New York"
}
print(person["name"])  # Alice</code></pre>
    `,
    example: 'students = ["Alice", "Bob", "Charlie"]\ngrades = {"Alice": 85, "Bob": 92, "Charlie": 78}\n\nfor student in students:\n    print(f"{student}: {grades[student]}")'
  },
  {
    id: 6,
    title: "Error Handling",
    description: "Learn to handle errors gracefully in your Python programs.",
    icon: "fas fa-exclamation-triangle",
    content: `
      <h2>Error Handling</h2>
      <p>Error handling allows your program to respond to errors gracefully instead of crashing.</p>
      
      <h3>Try-Except Blocks:</h3>
      <pre><code>try:
    number = int(input("Enter a number: "))
    result = 10 / number
    print(f"Result: {result}")
except ValueError:
    print("Please enter a valid number")
except ZeroDivisionError:
    print("Cannot divide by zero")
except Exception as e:
    print(f"An error occurred: {e}")</code></pre>
      
      <h3>Finally Block:</h3>
      <pre><code>try:
    file = open("data.txt", "r")
    content = file.read()
except FileNotFoundError:
    print("File not found")
finally:
    file.close()  # Always executes</code></pre>
    `,
    example: 'try:\n    numbers = [1, 2, 3]\n    print(numbers[5])\nexcept IndexError:\n    print("Index out of range!")\nfinally:\n    print("This always runs")'
  },
  {
    id: 7,
    title: "Libraries & Modules",
    description: "Discover how to use Python's extensive library ecosystem.",
    icon: "fas fa-puzzle-piece",
    content: `
      <h2>Libraries and Modules</h2>
      <p>Python's power comes from its extensive library ecosystem. Libraries extend Python's functionality.</p>
      
      <h3>Importing Modules:</h3>
      <pre><code>import math
import random
from datetime import datetime</code></pre>
      
      <h3>Using Built-in Libraries:</h3>
      <pre><code># Math operations
print(math.sqrt(16))  # 4.0
print(math.pi)        # 3.14159...

# Random numbers
print(random.randint(1, 10))
print(random.choice(["red", "blue", "green"]))

# Date and time
now = datetime.now()
print(now.strftime("%Y-%m-%d %H:%M:%S"))</code></pre>
      
      <h3>Popular Third-party Libraries:</h3>
      <ul>
        <li><strong>requests:</strong> HTTP requests</li>
        <li><strong>pandas:</strong> Data analysis</li>
        <li><strong>numpy:</strong> Numerical computing</li>
        <li><strong>matplotlib:</strong> Data visualization</li>
      </ul>
    `,
    example: 'import random\nimport math\n\n# Generate random numbers and calculate their square root\nfor i in range(3):\n    num = random.randint(1, 100)\n    sqrt_num = math.sqrt(num)\n    print(f"√{num} = {sqrt_num:.2f}")'
  },
  {
    id: 8,
    title: "Basic Projects",
    description: "Apply your knowledge by building simple Python projects.",
    icon: "fas fa-rocket",
    content: `
      <h2>Basic Projects</h2>
      <p>Now that you've learned the fundamentals, let's build some simple projects!</p>
      
      <h3>Project Ideas:</h3>
      <ul>
        <li><strong>Password Generator:</strong> Create random secure passwords</li>
        <li><strong>Temperature Converter:</strong> Convert between Celsius and Fahrenheit</li>
        <li><strong>Simple Calculator:</strong> Perform basic math operations</li>
        <li><strong>Word Counter:</strong> Count words in a text</li>
      </ul>
      
      <h3>Example: Simple Calculator</h3>
      <pre><code>def calculator():
    print("Simple Calculator")
    print("Operations: +, -, *, /")
    
    num1 = float(input("Enter first number: "))
    operation = input("Enter operation: ")
    num2 = float(input("Enter second number: "))
    
    if operation == "+":
        result = num1 + num2
    elif operation == "-":
        result = num1 - num2
    elif operation == "*":
        result = num1 * num2
    elif operation == "/":
        result = num1 / num2 if num2 != 0 else "Cannot divide by zero"
    else:
        result = "Invalid operation"
    
    print(f"Result: {result}")

calculator()</code></pre>
    `,
    example: '# Simple word counter\ntext = "Python is awesome and Python is fun"\nwords = text.lower().split()\nword_count = {}\n\nfor word in words:\n    word_count[word] = word_count.get(word, 0) + 1\n\nprint("Word count:", word_count)'
  }
];

export const celebrationMemes = [
  "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
  "https://images.unsplash.com/photo-1556075798-4825dfaaf498?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
  "https://images.unsplash.com/photo-1534126416832-7d9634acfe1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
];
