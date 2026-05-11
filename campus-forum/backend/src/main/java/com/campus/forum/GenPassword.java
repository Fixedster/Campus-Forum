import cn.hutool.crypto.digest.BCrypt;

public class GenPassword {
    public static void main(String[] args) {
        String password = "admin123";
        String hash = BCrypt.hashpw(password, BCrypt.gensalt());
        System.out.println("Password: " + password);
        System.out.println("BCrypt Hash: " + hash);
    }
}