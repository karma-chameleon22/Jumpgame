import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.util.ArrayList;
import java.util.Random;

public class JumpGame extends JPanel implements ActionListener, KeyListener {

    // Game variables
    private Timer timer;
    private final int WIDTH = 800, HEIGHT = 600;
    private final int GRAVITY = 1;
    private final int JUMP_STRENGTH = -15;

    private int playerX = 100, playerY = 500;
    private int playerWidth = 50, playerHeight = 50;
    private int velocityY = 0;
    private boolean isJumping = false;

    private ArrayList<Rectangle> platforms;
    private Random rand;

    public JumpGame() {
        JFrame frame = new JFrame("Jumping Game");
        frame.setSize(WIDTH, HEIGHT);
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.add(this);
        frame.addKeyListener(this);
        frame.setResizable(false);
        frame.setVisible(true);

        timer = new Timer(20, this); // 50 FPS
        timer.start();

        rand = new Random();
        platforms = new ArrayList<>();
        createInitialPlatforms();
    }

    private void createInitialPlatforms() {
        for (int i = 0; i < 5; i++) {
            platforms.add(new Rectangle(i * 150 + 100, 500 - i * 80, 100, 10));
        }
    }

    @Override
    public void paintComponent(Graphics g) {
        super.paintComponent(g);

        // Clear screen
        g.setColor(Color.WHITE);
        g.fillRect(0, 0, WIDTH, HEIGHT);

        // Draw player
        g.setColor(Color.BLUE);
        g.fillRect(playerX, playerY, playerWidth, playerHeight);

        // Draw platforms
        g.setColor(Color.BLACK);
        for (Rectangle plat : platforms) {
            g.fillRect(plat.x, plat.y, plat.width, plat.height);
        }
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        // Gravity
        velocityY += GRAVITY;
        playerY += velocityY;

        // Platform collision
        for (Rectangle plat : platforms) {
            if (playerY + playerHeight <= plat.y && playerY + playerHeight + velocityY >= plat.y &&
                    playerX + playerWidth > plat.x && playerX < plat.x + plat.width) {
                playerY = plat.y - playerHeight;
                velocityY = 0;
                isJumping = false;
            }
        }

        // Scroll platforms
        for (Rectangle plat : platforms) {
            plat.x -= 5;
        }

        // Remove old platforms and add new ones
        if (platforms.get(0).x + platforms.get(0).width < 0) {
            platforms.remove(0);
            int lastX = platforms.get(platforms.size() - 1).x;
            int newY = 400 + rand.nextInt(150) - 75;
            platforms.add(new Rectangle(lastX + 150, newY, 100, 10));
        }

        // Game over check
        if (playerY > HEIGHT) {
            timer.stop();
            JOptionPane.showMessageDialog(this, "Game Over!");
            System.exit(0);
        }

        repaint();
    }

    @Override
    public void keyPressed(KeyEvent e) {
        if (!isJumping && e.getKeyCode() == KeyEvent.VK_SPACE) {
            velocityY = JUMP_STRENGTH;
            isJumping = true;
        }
    }

    @Override public void keyReleased(KeyEvent e) {}
    @Override public void keyTyped(KeyEvent e) {}

    public static void main(String[] args) {
        new JumpGame();
    }
}
